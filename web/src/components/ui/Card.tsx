import { PropsWithChildren, HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export default function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow shadow-black/20',
        'dark:border-white/10 dark:bg-slate-900/60 dark:shadow-black/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
