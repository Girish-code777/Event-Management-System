import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin','student','coordinator']).optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  phone: z.string().optional(),
});

router.post('/signup', async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { name, email, password, role, department, year, phone } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: role || 'student', department, year, phone });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;

// Current user profile
const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

router.get('/me', auth, async (req: Request, res: Response) => {
  const id = (req as any).user.sub;
  const user = await User.findById(id).select('name email role department year phone');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.patch('/me', auth, async (req: Request, res: Response) => {
  const id = (req as any).user.sub;
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const updated = await User.findByIdAndUpdate(id, parsed.data, { new: true }).select('name email role department year phone');
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});
