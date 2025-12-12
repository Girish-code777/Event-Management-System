import { PropsWithChildren } from 'react'
import { hasRole } from '../lib/auth'

export default function RequireRole({ roles, children }: PropsWithChildren<{ roles: Array<'admin'|'coordinator'|'student'> }>) {
  if (!hasRole(...roles)) return null
  return <>{children}</>
}
