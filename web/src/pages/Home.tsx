import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Sparkles, CalendarDays, MessageCircleQuestion, HelpCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-300" />
          <h1 className="text-2xl font-semibold">Welcome to Rajarajeshwari College Events</h1>
        </div>
        <p className="mt-2 text-white/80">Only Rajarajeshwari College events are showcased here. Browse upcoming events, register, chat, and leave feedback.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/events"><Button className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> View Events</Button></Link>
          <Link to="/chat"><Button className="bg-white/10 hover:bg-white/20 flex items-center gap-2"><MessageCircleQuestion className="h-4 w-4" /> Chat</Button></Link>
          <Link to="/help"><Button className="bg-white/10 hover:bg-white/20 flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Help</Button></Link>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-white/70">Tip</div>
          <div className="mt-1 font-medium">Click an event card to see details</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-white/70">Registration</div>
          <div className="mt-1 font-medium">You’ll be asked for your details before registering</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-white/70">Feedback</div>
          <div className="mt-1 font-medium">Rate and review events after attending</div>
        </Card>
      </div>
    </div>
  )
}
