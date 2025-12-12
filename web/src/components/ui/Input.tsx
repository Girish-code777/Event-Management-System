import { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur',
        'focus:ring-2 focus:ring-indigo-300/60',
        className
      )}
    />
  )
}
