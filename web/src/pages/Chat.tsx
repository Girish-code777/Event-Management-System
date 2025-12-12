import { useEffect, useRef, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { api } from '../lib/api'
import { useToast } from '../components/toast/ToastProvider'

interface ChatMessage { _id: string; name: string; message: string; createdAt: string }

export default function Chat() {
  const { show } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const lastFetch = useRef<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  async function load(initial=false) {
    try {
      const qs = lastFetch.current && !initial ? `?since=${encodeURIComponent(lastFetch.current)}` : ''
      const res: ChatMessage[] = await api(`/chat${qs}`)
      if (res.length) {
        setMessages(prev => {
          const merged = initial ? res : [...prev, ...res]
          lastFetch.current = merged[merged.length-1].createdAt
          return merged
        })
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 0)
      } else if (initial && !messages.length) {
        lastFetch.current = null
      }
    } catch (e: any) { show(e.message, 'error') }
  }

  useEffect(() => {
    load(true)
    const id = setInterval(() => load(false), 3000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function send(e: React.FormEvent) {
    e.preventDefault(); if (!text.trim()) return
    if (loading) return; setLoading(true)
    try {
      await api('/chat', { method: 'POST', body: JSON.stringify({ message: text.trim() }) })
      setText('')
      await load(false)
    } catch (e: any) {
      show(e.message, 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <h1 className="text-xl font-semibold">Chat</h1>
      </Card>
      <Card className="p-0 overflow-hidden">
        <div ref={listRef} className="h-[50vh] overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m._id} className="text-sm">
              <span className="font-semibold text-indigo-200">{m.name}</span>
              <span className="opacity-60 text-xs ml-2">{new Date(m.createdAt).toLocaleTimeString()}</span>
              <div className="text-white/90">{m.message}</div>
            </div>
          ))}
          {!messages.length && <div className="text-white/70 text-sm">No messages yet.</div>}
        </div>
        <form onSubmit={send} className="border-t border-white/10 p-3 flex gap-2">
          <Input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
          <Button type="submit" disabled={loading}>Send</Button>
        </form>
      </Card>
    </div>
  )
}
