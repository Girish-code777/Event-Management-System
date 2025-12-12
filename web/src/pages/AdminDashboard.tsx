import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import { api } from '../lib/api'
import { hasRole } from '../lib/auth'

interface Stats {
  events: { total: number; published: number; upcoming: number; past: number }
  registrations: { total: number; byStatus: { registered: number; waitlisted: number; cancelled: number; checked_in: number } }
  participants: { unique: number; checked_in: number }
  feedback: { average: number | null; count: number }
  users: { total: number; admins: number; coordinators: number; students: number }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    api('/events/stats')
      .then(setStats)
      .catch(e => setErr(e.message || 'Failed to load stats'))
  }, [])

  if (!hasRole('admin')) {
    return <div className="text-white/80">Only admins can view the dashboard.</div>
  }

  if (err) return <div className="text-rose-300">{err}</div>
  if (!stats) return <div className="text-white/80">Loading dashboard...</div>

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="text-white/60 text-sm">Total Events</div><div className="text-2xl font-semibold">{stats.events.total}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Published</div><div className="text-2xl font-semibold">{stats.events.published}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Upcoming</div><div className="text-2xl font-semibold">{stats.events.upcoming}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Past</div><div className="text-2xl font-semibold">{stats.events.past}</div></Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="text-white/60 text-sm">Registrations</div><div className="text-2xl font-semibold">{stats.registrations.total}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Registered</div><div className="text-2xl font-semibold">{stats.registrations.byStatus.registered}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Waitlisted</div><div className="text-2xl font-semibold">{stats.registrations.byStatus.waitlisted}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Checked-in</div><div className="text-2xl font-semibold">{stats.registrations.byStatus.checked_in}</div></Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="text-white/60 text-sm">Unique Participants</div><div className="text-2xl font-semibold">{stats.participants.unique}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Checked-in Participants</div><div className="text-2xl font-semibold">{stats.participants.checked_in}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Feedback Count</div><div className="text-2xl font-semibold">{stats.feedback.count}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Avg Rating</div><div className="text-2xl font-semibold">{stats.feedback.average ?? '—'}</div></Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><div className="text-white/60 text-sm">Total Users</div><div className="text-2xl font-semibold">{stats.users.total}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Admins</div><div className="text-2xl font-semibold">{stats.users.admins}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Coordinators</div><div className="text-2xl font-semibold">{stats.users.coordinators}</div></Card>
        <Card className="p-4"><div className="text-white/60 text-sm">Students</div><div className="text-2xl font-semibold">{stats.users.students}</div></Card>
      </div>
    </div>
  )
}
