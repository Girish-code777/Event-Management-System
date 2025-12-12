import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import Event from '../models/Event';
import { auth, requireRole } from '../middleware/auth';
import Registration from '../models/Registration';
import Feedback from '../models/Feedback';
import { sendMail } from '../utils/mailer';
import User from '../models/User';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const events = await Event.find({ isPublished: true }).sort({ date: 1 });
  res.json(events);
});

router.get('/all', auth, requireRole('admin', 'coordinator'), async (_req: Request, res: Response) => {
  const events = await Event.find().sort({ date: -1 });
  res.json(events);
});

// Admin stats dashboard
router.get('/stats', auth, requireRole('admin'), async (_req: Request, res: Response) => {
  const today = new Date().toISOString().slice(0, 10);
  const [
    totalEvents,
    publishedEvents,
    upcomingEvents,
    pastEvents,
    regGroup,
    uniqueParticipantsAgg,
    checkedIn,
    fbAgg,
    totalUsers,
    admins,
    coordinators,
    students
  ] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ isPublished: true }),
    Event.countDocuments({ date: { $gte: today } }),
    Event.countDocuments({ date: { $lt: today } }),
    Registration.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Registration.aggregate([{ $group: { _id: '$studentId' } }, { $count: 'count' }]),
    Registration.countDocuments({ status: 'checked_in' }),
    Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]),
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'coordinator' }),
    User.countDocuments({ role: 'student' })
  ]);

  const regs: Record<string, number> = {};
  for (const r of regGroup) regs[r._id] = r.count;
  const uniqueParticipants = uniqueParticipantsAgg[0]?.count || 0;
  const feedbackAvg = fbAgg[0]?.avg ? Number(fbAgg[0].avg.toFixed(2)) : null;
  const feedbackCount = fbAgg[0]?.count || 0;

  res.json({
    events: { total: totalEvents, published: publishedEvents, upcoming: upcomingEvents, past: pastEvents },
    registrations: {
      total: (regs['registered'] || 0) + (regs['waitlisted'] || 0) + (regs['cancelled'] || 0) + (regs['checked_in'] || 0),
      byStatus: {
        registered: regs['registered'] || 0,
        waitlisted: regs['waitlisted'] || 0,
        cancelled: regs['cancelled'] || 0,
        checked_in: regs['checked_in'] || 0,
      }
    },
    participants: { unique: uniqueParticipants, checked_in: checkedIn },
    feedback: { average: feedbackAvg, count: feedbackCount },
    users: { total: totalUsers, admins, coordinators, students }
  });
});

// Public event details with basic metrics
router.get('/:id', async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event || (!event.isPublished)) return res.status(404).json({ message: 'Event not found' });

  const [regCounts, fbStats] = await Promise.all([
    Registration.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Feedback.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
  ]);

  const counts: Record<string, number> = {};
  for (const c of regCounts) counts[c._id] = c.count;
  const registered = (counts['registered'] || 0) + (counts['checked_in'] || 0);
  const waitlisted = counts['waitlisted'] || 0;
  const cancelled = counts['cancelled'] || 0;
  const feedbackAvg = fbStats[0]?.avg ? Number(fbStats[0].avg.toFixed(2)) : null;
  const feedbackCount = fbStats[0]?.count || 0;

  res.json({
    event,
    metrics: { registered, waitlisted, cancelled, feedbackAvg, feedbackCount }
  });
});

const eventSchema = z.object({
  name: z.string().min(2),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(10),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  coverImageUrl: z.string().url().optional(),
  coordinators: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

router.post('/', auth, requireRole('admin'), async (req: Request, res: Response) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const payload = parsed.data as any;
  const createdBy = (req as any).user.sub;
  const event = await Event.create({ ...payload, createdBy });
  res.status(201).json(event);
});

router.patch('/:id', auth, requireRole('admin', 'coordinator'), async (req: Request, res: Response) => {
  const parsed = eventSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const updated = await Event.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ message: 'Event not found' });
  res.json(updated);
});

router.delete('/:id', auth, requireRole('admin'), async (req: Request, res: Response) => {
  const del = await Event.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ message: 'Event not found' });
  res.json({ success: true });
});

// Registration: student registers for event
router.post('/:id/register', auth, requireRole('student', 'admin', 'coordinator'), async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (!event || !event.isPublished) return res.status(404).json({ message: 'Event not found' });
  const studentId = (req as any).user.sub;

  const existing = await Registration.findOne({ eventId: event._id, studentId });
  if (existing && existing.status !== 'cancelled') {
    return res.status(409).json({ message: 'Already registered' });
  }

  const registeredCount = await Registration.countDocuments({ eventId: event._id, status: { $in: ['registered', 'checked_in'] } });
  const capacity = event.capacity ?? Infinity;
  const status = registeredCount >= capacity ? 'waitlisted' : 'registered';
  const registrationCode = Math.random().toString(36).slice(2, 10).toUpperCase();

  const reg = await Registration.findOneAndUpdate(
    { eventId: event._id, studentId },
    { status, registrationCode },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  // Fire-and-forget admin email notification
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'madhannayaka666@gmail.com';
    const student = await User.findById(studentId).select('name email department year phone');
    await sendMail({
      to: ADMIN_EMAIL,
      subject: `New ${status.toUpperCase()} - ${event.name}`,
      text: `A user has ${status} for the event "${event.name}" on ${event.date}.\n\n` +
            `Student details:\n` +
            `- Name: ${student?.name || 'N/A'}\n` +
            `- Email: ${student?.email || 'N/A'}\n` +
            `- Department: ${student?.department || 'N/A'}\n` +
            `- Year: ${student?.year || 'N/A'}\n` +
            `- Phone: ${student?.phone || 'N/A'}\n\n` +
            `Registration Code: ${registrationCode}`,
    });
  } catch (e) {
    console.warn('[registration email] failed', e);
  }
  res.status(201).json(reg);
});

// Cancel registration
router.post('/:id/cancel', auth, requireRole('student', 'admin', 'coordinator'), async (req: Request, res: Response) => {
  const studentId = (req as any).user.sub;
  const reg = await Registration.findOneAndUpdate(
    { eventId: req.params.id, studentId, status: { $in: ['registered', 'waitlisted'] } },
    { status: 'cancelled' },
    { new: true }
  );
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.json(reg);
});

// List registrations (staff)
router.get('/:id/registrations', auth, requireRole('admin', 'coordinator'), async (req: Request, res: Response) => {
  const regs = await Registration.find({ eventId: req.params.id }).populate('studentId', 'name email');
  res.json(regs);
});

// Check-in by code or studentId (staff)
const checkinSchema = z.object({
  code: z.string().optional(),
  studentId: z.string().optional()
}).refine(v => !!(v.code || v.studentId), { message: 'Provide code or studentId' });

router.post('/:id/checkin', auth, requireRole('admin', 'coordinator'), async (req: Request, res: Response) => {
  const parsed = checkinSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { code, studentId } = parsed.data;
  const query: any = { eventId: req.params.id };
  if (code) query.registrationCode = code;
  if (studentId) query.studentId = studentId;
  const reg = await Registration.findOneAndUpdate(query, { status: 'checked_in' }, { new: true });
  if (!reg) return res.status(404).json({ message: 'Registration not found' });
  res.json(reg);
});

// Feedback create or update by user
const feedbackSchema = z.object({ rating: z.number().int().min(1).max(5), comments: z.string().optional() });
router.post('/:id/feedback', auth, requireRole('student', 'admin', 'coordinator'), async (req: Request, res: Response) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const userId = (req as any).user.sub;
  const doc = await Feedback.findOneAndUpdate(
    { eventId: req.params.id, userId },
    parsed.data,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json(doc);
});

// Get feedback list (staff)
router.get('/:id/feedback', auth, requireRole('admin', 'coordinator'), async (req: Request, res: Response) => {
  const list = await Feedback.find({ eventId: req.params.id }).populate('userId', 'name email');
  res.json(list);
});

export default router;
