import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { auth } from '../middleware/auth'
import ChatMessage from '../models/ChatMessage'
import User from '../models/User'
import Event from '../models/Event'

const router = Router()

// List recent messages
router.get('/', async (req: Request, res: Response) => {
  const since = req.query.since ? new Date(String(req.query.since)) : null
  const query: any = since ? { createdAt: { $gt: since } } : {}
  const msgs = await ChatMessage.find(query).sort({ createdAt: -1 }).limit(50)
  res.json(msgs.reverse())
})

// Send a new message
const sendSchema = z.object({ message: z.string().trim().min(1).max(1000) })
router.post('/', auth, async (req: Request, res: Response) => {
  const parsed = sendSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  const userId = (req as any).user.sub
  const user = await User.findById(userId).select('name')
  const msg = await ChatMessage.create({ userId, name: user?.name || 'User', message: parsed.data.message })

  // Basic assistant auto-reply
  try {
    const reply = await generateAssistantReply(parsed.data.message)
    if (reply) {
      const botUser = await User.findOne({ email: 'assistant@rrc.local' })
      await ChatMessage.create({ userId: botUser?._id || userId, name: 'Assistant', message: reply })
    }
  } catch { /* ignore auto-reply errors */ }

  res.status(201).json(msg)
})

export default router

async function generateAssistantReply(text: string): Promise<string | null> {
  const q = text.toLowerCase()
  const upcoming = await Event.find({ isPublished: true }).sort({ date: 1 }).limit(5)
  const listStr = upcoming.map(e => `• ${e.name} on ${e.date}${e.venue ? ` at ${e.venue}` : ''}`).join('\n')

  if (/(hi|hello|hey)\b/.test(q)) {
    return 'Hello! I\'m your event assistant. Ask me about upcoming events, how to register, venues, or feedback.'
  }
  if (q.includes('event') || q.includes('events')) {
    if (upcoming.length === 0) return 'There are no upcoming events right now. Check back soon!'
    return `Here are some upcoming events:\n${listStr}\nYou can browse all events on the Events page and click Register.`
  }
  if (q.includes('register') || q.includes('signup')) {
    return 'To register: Login as a student, open Events, click Register on the desired event, fill your details, and confirm.'
  }
  if (q.includes('where') || q.includes('venue') || q.includes('location')) {
    const withVenue = upcoming.find(e => e.venue)
    if (withVenue) return `${withVenue.name} is scheduled at ${withVenue.venue} on ${withVenue.date}.`
    return 'Venues are listed on each event card and details page.'
  }
  if (q.includes('when') || q.includes('date') || q.includes('time')) {
    const next = upcoming[0]
    if (next) return `${next.name} is on ${next.date}${next.startTime ? ` starting ${next.startTime}` : ''}.`
    return 'Dates and times are shown on each event card and details page.'
  }
  if (q.includes('feedback')) {
    return 'Open an event\'s details page to leave a rating and comments under "Leave feedback".'
  }
  if (q.includes('admin') || q.includes('create event')) {
    return 'Admins and coordinators can add events from the Admin page. Use the seeded admin account or request access.'
  }
  return 'I\'m here to help with events, registration, venues, and feedback. Try asking: "Show upcoming events" or "How to register?"'
}
