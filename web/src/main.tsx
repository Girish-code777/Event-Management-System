import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import AdminEvents from './pages/AdminEvents'
import StaffEvent from './pages/StaffEvent'
import ToastProvider from './components/toast/ToastProvider'
import Feedbacks from './pages/Feedbacks'
import Chat from './pages/Chat'
import Help from './pages/Help'
import Home from './pages/Home'
// Auth gating removed to allow public access to pages by default
import Payment from './pages/Payment'
import AdminDashboard from './pages/AdminDashboard'
import CreateEvent from './pages/CreateEvent'

const router = createBrowserRouter([
  { path: '/', element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'events', element: <Events /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'feedbacks', element: <Feedbacks /> },
      { path: 'chat', element: <Chat /> },
      { path: 'help', element: <Help /> },
      { path: 'payment', element: <Payment /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
      { path: 'admin/create', element: <CreateEvent /> },
      { path: 'event/:id', element: <EventDetails /> },
      { path: 'admin', element: <AdminEvents /> },
      { path: 'staff/:id', element: <StaffEvent /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
)
