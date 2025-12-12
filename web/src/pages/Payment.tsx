import Card from '../components/ui/Card'
import { useMemo, useState } from 'react'

export default function Payment() {
  const upiId = '9742934773@superyes'
  const upiName = 'KUSHAL GOWDA C'
  const upiUrl = useMemo(() => `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}`,[upiId, upiName])
  const fallbackQr = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiUrl)}`,[upiUrl])
  const [imgSrc, setImgSrc] = useState('/payment-qr.png')

  return (
    <div className="grid gap-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold mb-4">Payment</h1>
        <div className="flex flex-col items-center gap-3">
          <a href={imgSrc} target="_blank" rel="noreferrer">
            <img
              src={imgSrc}
              alt="Payment QR"
              className="max-w-xs w-full rounded-lg border border-white/20 bg-white"
              onError={() => setImgSrc(fallbackQr)}
            />
          </a>
          <div className="text-white/80 text-sm text-center">
            Scan the QR to pay
          </div>
          <div className="text-white/90 text-sm text-center">
            {upiName}
          </div>
          <div className="text-white/70 text-xs text-center break-all">
            UPI ID: {upiId}
          </div>
          <a className="inline-block mt-1 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white" href={upiUrl}>
            Open in UPI app
          </a>
        </div>
      </Card>
    </div>
  )
}
