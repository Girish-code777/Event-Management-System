import { getToken } from './auth'

const BASE = 'http://localhost:4000'

export async function api(path: string, options: RequestInit = {}) {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { ...options, headers: { ...headers, ...(options.headers as any) } })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
