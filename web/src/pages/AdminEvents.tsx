import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useToast } from '../components/toast/ToastProvider'
import { hasRole } from '../lib/auth'

interface EventItem { _id: string; name: string; date: string; isPublished?: boolean }

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const { show } = useToast()

  async function load() {
    try { setEvents(await api('/events/all')) } catch (e: any) { show(e.message, 'error') }
  }
  useEffect(() => { load() }, [])

  async function createEvent(e: React.FormEvent) {
    e.preventDefault()
    try {
      await api('/events', { method: 'POST', body: JSON.stringify({ name, date, isPublished }) })
      setName(''); setDate(''); setIsPublished(true)
      show('Event created', 'success')
      await load()
    } catch (err: any) { show(err.message, 'error') }
  }

  if (!hasRole('admin','coordinator')) {
    return <div className="text-white/80">You need admin or coordinator role to access this page.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin: Events</h1>

      <Card className="p-4 mb-6">
        <form onSubmit={createEvent} className="flex flex-wrap gap-3 items-end">
          <div className="min-w-[220px]">
            <label className="block text-sm mb-1 text-white/80">Name</label>
            <Input value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Date</label>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/90">
            <input type="checkbox" className="accent-indigo-500" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} /> Published
          </label>
          <Button type="submit">Create</Button>
        </form>
      </Card>

      <div className="grid gap-3">
        {events.map(ev => (
          <Card key={ev._id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{ev.name}</div>
              <div className="text-sm text-white/80">{ev.date}</div>
            </div>
            {ev.isPublished ? <Badge>Published</Badge> : <Badge className="bg-white/5">Draft</Badge>}
          </Card>
        ))}
        {events.length === 0 && <div className="text-white/70">No events yet.</div>}
      </div>
    </div>
  )
}
