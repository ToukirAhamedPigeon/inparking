// app/not-found.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/custom/Footer'

export default function NotFoundPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect after a few seconds, if needed
    setTimeout(() => {
      router.push('/') // Redirect to homepage or any page of your choice
    }, 5000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CB356B] to-[#BD3F32]">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg">Oops! The page you're looking for doesn't exist.</p>
        <p className="mt-2">We'll redirect you to the homepage shortly...</p>
        <Footer footerClasses="bottom-0 py-4 text-center text-xs text-slate-200 overflow-hidden mt-80" linkClasses="text-white hover:underline" />
      </div>
    </div>
  )
}
