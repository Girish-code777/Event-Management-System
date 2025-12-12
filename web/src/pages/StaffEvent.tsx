import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useToast } from '../components/toast/ToastProvider'
import { hasRole } from '../lib/auth'

interface Registration { _id: string; studentId: { _id: string; name: string; email: string }; status: string; registrationCode: string }

export default function StaffEvent() {
  const { id } = useParams()
  const [regs, setRegs] = useState<Registration[]>([])
  const [code, setCode] = useState('')
  const { show } = useToast()

  async function load() {
    if (!id) return
    try { setRegs(await api(`/events/${id}/registrations`)) } catch (e: any) { show(e.message, 'error') }
  }
  useEffect(() => { load() }, [id])

  async function checkinByCode(e: React.FormEvent) {
    e.preventDefault(); if (!id) return
    try { await api(`/events/${id}/checkin`, { method: 'POST', body: JSON.stringify({ code }) }); show('Checked in', 'success'); setCode(''); load() }
    catch (err: any) { show(err.message, 'error') }
  }

  if (!hasRole('admin','coordinator')) {
    return <div className="text-white/80">You need staff access to check-in.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Staff: Check-in</h1>

      <Card className="p-4 mb-4">
        <form onSubmit={checkinByCode} className="flex gap-3 items-end">
          <div>
            <label className="block text-sm mb-1 text-white/80">Registration code</label>
            <Input value={code} onChange={e=>setCode(e.target.value)} />
          </div>
          <Button type="submit">Check in</Button>
        </form>
      </Card>

      <div className="grid gap-3">
        {regs.map(r => (
          <Card key={r._id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{r.studentId?.name || 'Unknown'}</div>
              <div className="text-sm text-white/80">{r.studentId?.email}</div>
            </div>
            <div className="text-sm flex items-center gap-3">
              <Badge>{r.status}</Badge>
              <span className="opacity-80">{r.registrationCode}</span>
            </div>
          </Card>
        ))}
        {regs.length === 0 && <div className="text-white/70">No registrations yet.</div>}
      </div>
    </div>
  )
}
