'use client'

import { useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import InputSection from '@/components/module/public/homepage/InputSection'
import HeroSection from '@/components/module/public/homepage/HeroSection'
import CarAnimation from '@/components/module/public/homepage/CarAnimation'
import NavigateButton from '@/components/module/public/homepage/NavigateButton'
import FooterSection from '@/components/module/public/homepage/FooterSection'
import { IAllotment, IImage } from '@/types'
import api from '@/lib/axios'
import AllotmentSection from '@/components/module/public/homepage/AllotmentSection'

export default function HomePage() {
  const inputRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showInput, setShowInput] = useState(false)
  const [showScanner, setShowScanner] = useState(true)
  const [selectedAllotment, setSelectedAllotment] = useState<IAllotment | null>(null)
  const [routeImages, setRouteImages] = useState<IImage[]>([])
  const [errorMessage, setErrorMessage] = useState("")

  const handleScroll = () => {
    setShowInput(true)
    setTimeout(() => {
      if (!isDesktop && inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
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
      const res = await api.get(`/showAllotments?dateTimeFormatId=${code}`)
      const data = res.data
      console.log(data)
      if (!res || !data || !data.success || !data.allotment) {
        setErrorMessage("Invalid QR Code. Please scan again.")
      }
      setSelectedAllotment(data.allotment)
      setRouteImages(data.routeImages)
    } catch (err) {
      setErrorMessage("Invalid QR Code. Please scan again.")
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
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-6 text-red-600 font-semibold text-center animate-pulse">
          {errorMessage}
        </div>
      )}

      {/* Allotment Table */}
      {selectedAllotment && (
        <AllotmentSection allotment={selectedAllotment} routeImages={routeImages} />
      )}

      <FooterSection />
    </main>
  )
}
