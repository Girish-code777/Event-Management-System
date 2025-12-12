import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { api } from '../lib/api'
import { hasRole } from '../lib/auth'
import { useToast } from '../components/toast/ToastProvider'

export default function CreateEvent() {
  const { show } = useToast()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [venue, setVenue] = useState('')
  const [capacity, setCapacity] = useState<number | ''>('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)

  if (!hasRole('admin')) {
    return <div className="text-white/80">Only admins can create events.</div>
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await api('/events', {
        method: 'POST',
        body: JSON.stringify({
          name,
          date,
          category: category || undefined,
          venue: venue || undefined,
          capacity: capacity === '' ? undefined : Number(capacity),
          startTime: startTime || undefined,
          endTime: endTime || undefined,
          description: description || undefined,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
          isPublished,
        })
      })
      show('Event created', 'success')
      setName('')
      setDate('')
      setCategory('')
      setVenue('')
      setCapacity('')
      setStartTime('')
      setEndTime('')
      setDescription('')
      setTags('')
      setIsPublished(true)
    } catch (e: any) {
      show(e.message || 'Failed to create event', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Event</h1>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Name</label>
            <Input value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Date</label>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Category</label>
            <Input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g., Tech" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Venue</label>
            <Input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="e.g., Auditorium" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Capacity</label>
            <Input type="number" value={capacity} onChange={e=>setCapacity(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 300" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">Start Time</label>
            <Input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/80">End Time</label>
            <Input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Description</label>
            <Input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1 text-white/80">Tags (comma separated)</label>
            <Input value={tags} onChange={e=>setTags(e.target.value)} placeholder="AI, ML" />
          </div>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-white/90">
            <input type="checkbox" className="accent-indigo-500" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} /> Published
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
