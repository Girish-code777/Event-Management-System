import { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../lib/auth'

export default function RequireAuth({ children }: PropsWithChildren) {
  const token = getToken()
  const loc = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />
  return <>{children}</>
}
