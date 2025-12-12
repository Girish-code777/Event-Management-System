import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import { api } from '../lib/api'
import { useToast } from '../components/toast/ToastProvider'
import { Calendar, MapPin, Star } from 'lucide-react'

interface EventDoc { _id: string; name: string; date: string; description?: string; venue?: string; capacity?: number; category?: string }

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState<EventDoc | null>(null)
  const [metrics, setMetrics] = useState<{ registered: number; waitlisted: number; cancelled: number; feedbackAvg: number | null; feedbackCount: number } | null>(null)
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState('')
  const { show } = useToast()

  async function load() {
    if (!id) return
    try {
      const res = await api(`/events/${id}`)
      setEvent(res.event)
      setMetrics(res.metrics)
    } catch (e: any) {
      show(e.message, 'error')
    }
  }
  useEffect(() => { load() }, [id])

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault(); if (!id) return
    try {
      await api(`/events/${id}/feedback`, { method: 'POST', body: JSON.stringify({ rating, comments }) })
      show('Feedback submitted', 'success')
      setComments('')
      await load()
    } catch (err: any) { show(err.message, 'error') }
  }

  if (!event) return <div className="text-white/80">Loading...</div>

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="p-5 lg:col-span-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{event.name}</h1>
            <div className="mt-2 text-sm text-white/80 flex flex-wrap items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-300" /> {event.date}
              {event.venue && <><span className="opacity-50">•</span><MapPin className="h-4 w-4 text-teal-300" /> {event.venue}</>}
              {event.category && <><span className="opacity-50">•</span><Badge>{event.category}</Badge></>}
              {typeof event.capacity === 'number' && <><span className="opacity-50">•</span><span className="text-white/80">Capacity {event.capacity}</span></>}
            </div>
          </div>
        </div>
        {event.description && <p className="mt-4 text-white/90 leading-relaxed">{event.description}</p>}
      </Card>

      <Card className="p-5">
        <div className="font-medium mb-2">Metrics</div>
        {metrics ? (
          <div className="text-sm space-y-1">
            <div>Registered: <span className="font-semibold">{metrics.registered}</span></div>
            <div>Waitlisted: <span className="font-semibold">{metrics.waitlisted}</span></div>
            <div>Cancelled: <span className="font-semibold">{metrics.cancelled}</span></div>
            <div className="flex items-center gap-2">Average rating: {metrics.feedbackAvg ?? '—'} {metrics.feedbackCount ? <span className="text-white/60">({metrics.feedbackCount})</span> : null}</div>
          </div>
        ) : <div className="text-white/70 text-sm">No metrics yet.</div>}
      </Card>

      <Card className="p-5 lg:col-span-2">
        <div className="font-medium mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-yellow-300" /> Leave feedback</div>
        <form onSubmit={submitFeedback} className="grid gap-3 sm:grid-cols-3 items-start">
          <div>
            <label className="block text-sm mb-1 text-white/80">Rating</label>
            <Input type="number" min={1} max={5} value={rating} onChange={e=>setRating(Number(e.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Comments</label>
            <Input value={comments} onChange={e=>setComments(e.target.value)} placeholder="Share your thoughts" />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit">Submit feedback</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
