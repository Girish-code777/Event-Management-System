import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { getToken } from '../lib/auth'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { useToast } from '../components/toast/ToastProvider'
import { Link, useNavigate } from 'react-router-dom'

interface EventItem { _id: string; name: string; date: string; description?: string; venue?: string; category?: string }

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const { show } = useToast()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    api('/events').then(setEvents).catch(e=>show(e.message, 'error'))
  }, [show])

  async function openRegister(eventId: string) {
    if (!getToken()) { show('Login as student to register', 'info'); return }
    setActiveEventId(eventId)
    try {
      const me = await api('/auth/me')
      setName(me.name || '')
      setEmail(me.email || '')
      setDepartment(me.department || '')
      setYear(me.year || '')
      setPhone(me.phone || '')
    } catch {
      // ignore prefill errors
    }
    setModalOpen(true)
  }

  async function submitRegistration(e: React.FormEvent) {
    e.preventDefault()
    if (!activeEventId) return
    try {
      await api('/auth/me', { method: 'PATCH', body: JSON.stringify({ name, email, department, year, phone }) })
      await api(`/events/${activeEventId}/register`, { method: 'POST' })
      setModalOpen(false)
      show('Registered successfully', 'success')
    } catch (err: any) {
      show(err.message, 'error')
    }
  }

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-300" />
          <h1 className="text-2xl font-semibold">Rajarajeshwari College Events</h1>
        </div>
        <div className="mt-1 text-sm text-white/70">Only Rajarajeshwari College events are listed here.</div>
      </div>
      {!getToken() && (
        <Card className="p-4 mb-4 border-indigo-400/30">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-white/90">Login to register for events and manage your registrations.</div>
            <div className="ml-auto flex gap-2">
              <Link to="/login"><Button className="px-3 py-1.5">Login</Button></Link>
              <Link to="/signup"><Button className="px-3 py-1.5 bg-white/10 hover:bg-white/20">Signup</Button></Link>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map(e => (
          <Card
            key={e._id}
            className="p-4 group overflow-hidden cursor-pointer"
            onClick={() => navigate(`/event/${e._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); navigate(`/event/${e._id}`) } }}
          >
            <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-400/20 to-fuchsia-400/10 blur-2xl group-hover:scale-110 transition" />
            <div className="flex items-start justify-between">
              <Link to={`/event/${e._id}`} className="font-medium text-lg hover:underline underline-offset-2">{e.name}</Link>
              {e.category && <Badge className="ml-2">{e.category}</Badge>}
            </div>
            <div className="mt-1 text-sm text-white/80 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-300" /> {e.date}
              {e.venue && <><span className="opacity-50">•</span><MapPin className="h-4 w-4 text-teal-300" /> {e.venue}</>}
            </div>
            {e.description && <p className="text-sm mt-3 text-white/90">{e.description}</p>}
            <Button className="mt-4" onClick={(ev) => { ev.stopPropagation(); openRegister(e._id) }}>Register</Button>
          </Card>
        ))}
        {events.length === 0 && <div className="text-white/70">No events yet.</div>}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Details</h2>
              <form className="grid gap-3" onSubmit={submitRegistration}>
                <div>
                  <label className="block text-sm mb-1 text-white/80">Full name</label>
                  <Input value={name} onChange={(e)=>setName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-white/80">Email</label>
                  <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1 text-white/80">Department</label>
                    <Input value={department} onChange={(e)=>setDepartment(e.target.value)} placeholder="e.g., CSE" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-white/80">Year</label>
                    <Input value={year} onChange={(e)=>setYear(e.target.value)} placeholder="e.g., 3rd" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-white/80">Phone</label>
                  <Input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="10-digit number" />
                </div>
                <div className="mt-2 flex gap-3 justify-end">
                  <Button type="button" className="bg-white/10 hover:bg-white/20" onClick={()=>setModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Confirm & Register</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
