import { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export default function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} className={cn('inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-xs text-white', className)} />
  )
}
