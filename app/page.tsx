'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from 'usehooks-ts'
import { Input } from "@/components/ui/input"
import QrScanner from '@/components/custom/QRCodeScanner'

export default function HomePage() {
  const inputRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showInput, setShowInput] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [showScanner, setShowScanner] = useState(true)

  const handleScroll = () => {
    setShowInput(true)
    setTimeout(() => {
      if (!isDesktop && inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const handleScan = (value: string) => {
    setQrCode(value)
    setShowScanner(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-blue-700 text-center mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span className='text-[30px]'>Welcome to</span><br /> <span className='text-red-500'>In-Parking</span>
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 text-center mb-8 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
      >
        Smart, secure, and efficient indoor car parking guidance. Navigate your lot with ease.
      </motion.p>

      <motion.div
        className="w-[300px] md:w-[400px] mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Image
          src="/assets/car-animation.gif"
          alt="Animated Cartoon Car"
          width={150}
          height={150}
          className="mx-auto"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Button
          className="text-lg px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition"
          onClick={handleScroll}
        >
          Navigate to Parking Lot
        </Button>
      </motion.div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            key="inputSection"
            ref={inputRef}
            className="mt-16 w-full flex justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {!isDesktop && showScanner && (
                <div className="w-full max-h-[280px] overflow-hidden bg-slate-300 rounded-xl shadow-xl">
                  <p className="mb-2">Scan QR Code to Find Your Spot</p>
                  <QrScanner onScan={handleScan} />
                </div>
              )}

              {!isDesktop && !showScanner && (
                <Button
                  onClick={() => setShowScanner(true)}
                  className="text-sm px-4 py-2 mt-2"
                >
                  Scan Again
                </Button>
              )}

              <div className="w-full">
                <label className="block text-gray-700 font-semibold mb-2 text-center">
                  {isDesktop ? 'Enter QR Code Number' : 'Or enter QR Code Number'}
                </label>
                <Input
                  type="text"
                  placeholder="Enter code here"
                  className="w-full"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
