import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { getToken, setAuth } from '../lib/auth'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useToast } from '../components/toast/ToastProvider'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const nav = useNavigate()
  const loc = useLocation() as any
  const { show } = useToast()

  useEffect(() => {
    if (getToken()) {
      const from = loc?.state?.from?.pathname || '/'
      nav(from, { replace: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      setAuth(res.token, res.user)
      show(`Welcome back, ${res.user.name}`, 'success')
      const from = loc?.state?.from?.pathname || '/'
      nav(from, { replace: true })
    } catch (err: any) {
      show(err.message || 'Login failed', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button type="submit">Login</Button>
        </form>
        <p className="mt-3 text-sm text-white/80">No account? <Link to="/signup" className="text-indigo-300">Signup</Link></p>
      </Card>
    </div>
  )
}
