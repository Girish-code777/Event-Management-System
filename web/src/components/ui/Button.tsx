import { cn } from '../../utils/cn'
import { ButtonHTMLAttributes } from 'react'

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm text-white shadow-sm backdrop-blur transition hover:bg-white/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60',
        'dark:border-white/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        'dark:focus-visible:ring-indigo-500/40',
        className
      )}
    />
  )
}
