import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getToken, logout, hasRole } from './lib/auth'
import { Sparkles, Menu, X, Home as HomeIcon, CalendarDays, MessageCircle, HelpCircle, Shield } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [token, setToken] = useState<string | null>(getToken())
  const loc = useLocation()
  useEffect(() => setToken(getToken()), [loc])
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem('sidebarCollapsed') === '1' } catch { return false }
  })
  useEffect(() => { try { localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0') } catch {} }, [collapsed])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-40" style={{background:"radial-gradient(600px 200px at 10% 10%, rgba(99,102,241,0.3), transparent), radial-gradient(600px 200px at 90% 20%, rgba(20,184,166,0.25), transparent), radial-gradient(800px 300px at 50% 90%, rgba(168,85,247,0.2), transparent)"}} />
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-20 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
        <div className="px-4 py-3 flex items-center gap-3">
          <button aria-label="Open menu" className="rounded-md p-2 hover:bg-white/10 border border-white/10" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-indigo-300" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-teal-300 to-fuchsia-300">RRC Events</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Sidebar + Main layout */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <aside className={`hidden md:flex md:flex-col ${collapsed ? 'md:w-20' : 'md:w-64'} md:min-h-screen md:sticky md:top-0 md:py-8 md:pr-6`}>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl shadow-black/20 p-4 h-fit">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-5 w-5 text-indigo-300" />
                  {!collapsed && <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-teal-300 to-fuchsia-300">Rajarajeshwari College Events</span>}
                </Link>
                <button aria-label="Collapse sidebar" className="rounded-md p-2 hover:bg-white/10 border border-white/10" onClick={() => setCollapsed(!collapsed)}>
                  {collapsed ? '>>' : '<<'}
                </button>
              </div>
              <nav className="mt-5 grid gap-1 text-sm">
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname === '/' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/">
                  <HomeIcon className="h-4 w-4" />
                  {!collapsed && <span>Home</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/events') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/events">
                  <CalendarDays className="h-4 w-4" />
                  {!collapsed && <span>Events</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/feedbacks') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/feedbacks">
                  <MessageCircle className="h-4 w-4" />
                  {!collapsed && <span>Feedbacks</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/chat') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/chat">
                  <MessageCircle className="h-4 w-4" />
                  {!collapsed && <span>Chat</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/help') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/help">
                  <HelpCircle className="h-4 w-4" />
                  {!collapsed && <span>Help</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/admin-dashboard') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin-dashboard">
                  <Sparkles className="h-4 w-4" />
                  {!collapsed && <span>Dashboard</span>}
                </Link>
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/payment') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/payment">
                  <Sparkles className="h-4 w-4" />
                  {!collapsed && <span>Payment</span>}
                </Link>
                {hasRole('admin','coordinator') && (
                  <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/admin') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin">
                    <Shield className="h-4 w-4" />
                    {!collapsed && <span>Admin</span>}
                  </Link>
                )}
                <Link className={`px-3 py-2 rounded-md flex items-center gap-3 ${loc.pathname.startsWith('/admin/create') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin/create">
                  <Sparkles className="h-4 w-4" />
                  {!collapsed && <span>Create Event</span>}
                </Link>
              </nav>
              <div className="mt-6 flex items-center justify-between">
                <ThemeToggle />
                {!collapsed && (!token ? (
                  <div className="flex gap-2">
                    <Link to="/login" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20">Login</Link>
                    <Link to="/signup" className="px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white">Signup</Link>
                  </div>
                ) : (
                  <button onClick={() => { logout(); setToken(null) }} className="px-3 py-1.5 rounded-md bg-rose-500/90 hover:bg-rose-500">Logout</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className={`flex-1 md:py-8 ${collapsed ? 'md:pl-6' : 'md:pl-6'} w-full py-6`}>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl shadow-black/20 p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-72 h-full bg-slate-900/90 backdrop-blur border-r border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-5 w-5 text-indigo-300" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-teal-300 to-fuchsia-300">RRC Events</span>
              </div>
              <button aria-label="Close menu" className="rounded-md p-2 hover:bg-white/10 border border-white/10" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-5 grid gap-1 text-sm">
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname === '/' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/">Home</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/events') || loc.pathname === '/' ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/events">Events</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/feedbacks') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/feedbacks">Feedbacks</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/chat') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/chat">Chat</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/help') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/help">Help</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/admin-dashboard') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin-dashboard">Dashboard</Link>
              <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/payment') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/payment">Payment</Link>
              {hasRole('admin','coordinator') && (
                <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/admin') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin">Admin</Link>
              )}
              {hasRole('admin') && (
                <Link onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md ${loc.pathname.startsWith('/admin/create') ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10'}`} to="/admin/create">Create Event</Link>
              )}
            </nav>
            <div className="mt-6 flex items-center justify-between">
              <ThemeToggle />
              {!token && <div className="flex gap-2">
                <Link onClick={() => setOpen(false)} to="/login" className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20">Login</Link>
                <Link onClick={() => setOpen(false)} to="/signup" className="px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white">Signup</Link>
              </div>}
              {token && <button onClick={() => { logout(); setToken(null); setOpen(false) }} className="px-3 py-1.5 rounded-md bg-rose-500/90 hover:bg-rose-500">Logout</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
