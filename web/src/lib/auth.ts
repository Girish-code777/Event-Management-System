const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export type User = { id: string; name: string; email: string; role: 'admin'|'student'|'coordinator' }

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): User | null {
  const v = localStorage.getItem(USER_KEY)
  return v ? JSON.parse(v) as User : null
}

export function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function hasRole(...roles: User['role'][]) {
  const u = getUser()
  return !!u && roles.includes(u.role)
}
