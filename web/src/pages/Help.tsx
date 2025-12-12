import Card from '../components/ui/Card'

const ADMIN_EMAIL = 'madhannayaka666@gmail.com'
const ADMIN_PHONE = '+918147248656'

export default function Help() {
  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-2">Help & Support</h1>
        <p className="text-white/80">If you need assistance with registrations, event details, or account access, reach out to the administrator.</p>
      </Card>
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Contact Admin</h2>
        <p className="text-white/80 mb-3">Send us an email and we will get back to you shortly.</p>
        <a className="inline-block px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white" href={`mailto:${ADMIN_EMAIL}`}>Email: {ADMIN_EMAIL}</a>
        <div className="mt-3 text-white/80">
          <div className="text-sm mb-1">Or call:</div>
          <a className="inline-block px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20" href={`tel:${ADMIN_PHONE}`}>{ADMIN_PHONE}</a>
        </div>
      </Card>
    </div>
  )
}
