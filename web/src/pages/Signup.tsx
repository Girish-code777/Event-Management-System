import { useState } from 'react'
import { api } from '../lib/api'
import { setAuth } from '../lib/auth'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../components/toast/ToastProvider'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student'|'admin'|'coordinator'>('student')
  const nav = useNavigate()
  const { show } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await api('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password, role }) })
      setAuth(res.token, res.user)
      show(`Welcome, ${res.user.name}`, 'success')
      nav('/')
    } catch (err: any) {
      show(err.message || 'Signup failed', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Create account</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select
            className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white"
            value={role}
            onChange={e=>setRole(e.target.value as 'student'|'admin'|'coordinator')}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="coordinator">Coordinator</option>
          </select>
          <Button type="submit">Create account</Button>
        </form>
        <p className="mt-3 text-sm text-white/80">Have an account? <Link to="/login" className="text-indigo-300">Login</Link></p>
      </Card>
    </div>
  )
}
