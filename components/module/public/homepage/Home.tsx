'use client'

import { useRef, useState, useEffect } from 'react'
import InputSection from '@/components/module/public/homepage/InputSection'
import HeroSection from '@/components/module/public/homepage/HeroSection'
import CarAnimation from '@/components/module/public/homepage/CarAnimation'
import NavigateButton from '@/components/module/public/homepage/NavigateButton'
import FooterSection from '@/components/module/public/homepage/FooterSection'
import { IAllotment, IImage } from '@/types'
import api from '@/lib/axios'
import AllotmentSection from '@/components/module/public/homepage/AllotmentSection'

export default function Home() {
  const inputRef = useRef<HTMLDivElement>(null)
  const [qrid, setQrid] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [showScanner, setShowScanner] = useState(true)
  const [selectedAllotment, setSelectedAllotment] = useState<IAllotment | null>(null)
  const [routeImages, setRouteImages] = useState<IImage[]>([])
  const [zoneImages, setZoneImages] = useState<IImage[]>([])
  const [slotImages, setSlotImages] = useState<IImage[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const qridFromUrl = urlParams.get('qrid') || ''
    const refinedQrid = qridFromUrl.replace(/^.*[?&]qrid=|[^a-zA-Z0-9]/g, '') || ''
    console.log('QRID from URL:', refinedQrid)
    if (refinedQrid) {
      setShowScanner(false)
      fetchAllotment(refinedQrid)
      handleScroll(350, 300)
    }
  }, [])

  const handleScroll = (top: number = 400, seconds: number = 100) => {
    setShowInput(true)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
        setTimeout(() => {
          window.scrollBy({ top: top, behavior: 'smooth' }) // adjust '100' as needed
        }, 400)
      }
    }, seconds)
  }

  const handleScan = (value: string) => {
    setShowScanner(false)
    fetchAllotment(value) // Automatically trigger submit with scanned QR code
  }

  const handleSubmit = (value: string) => {
    setShowScanner(false)
    fetchAllotment(value)
  }

  const fetchAllotment = async (code: string) => {
    setErrorMessage("")
    setSelectedAllotment(null)
    try {
      const res = await api.get(`/showAllotment?dateTimeFormatId=${code}`)
      const data = res.data
      if ((!res || !data || !data.success || !data.allotment) && res.status !== 404) {
        setErrorMessage(res.data.message)
        return
      }
      setQrid(code)
      setSelectedAllotment(data.allotment)
      setRouteImages(data.routeImages)
      setZoneImages(data.zoneImages)
      setSlotImages(data.slotImages)
    } catch (err) {
      setErrorMessage((err as any).response.data.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <HeroSection />
      <CarAnimation />
      <NavigateButton onClick={handleScroll} />
      
      {/* QR Code input section */}
      <InputSection 
        showInput={showInput} 
        inputRef={inputRef as React.RefObject<HTMLDivElement>}
        showScanner={showScanner}
        onScan={handleScan}
        onSubmit={handleSubmit}
        onRetry={() => setShowScanner(true)}
        initialValue={qrid} // This value is now directly passed
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-6 text-red-600 font-semibold text-center animate-pulse">
          {errorMessage}
        </div>
      )}

      {/* Allotment Table */}
      {selectedAllotment && (
        <AllotmentSection allotment={selectedAllotment} routeImages={routeImages} zoneImages={zoneImages} slotImages={slotImages} />
      )}

      <FooterSection />
    </main>
  )
}
