import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'
import { cn } from '../../utils/cn'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'
export type Toast = { id: number; type: ToastType; message: string }

const ToastCtx = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null)

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur',
            'border-white/15 bg-white/10 text-white')}
          >
            {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-300" />}
            {t.type === 'error' && <AlertTriangle className="h-4 w-4 text-rose-300" />}
            {t.type === 'info' && <Info className="h-4 w-4 text-indigo-300" />}
            <span className="text-sm">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
