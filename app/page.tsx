'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from 'usehooks-ts'
import { Input } from "@/components/ui/input"
import QRCodeScanner from '@/components/custom/QRCodeScanner'

export default function HomePage() {
  const inputRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [showInput, setShowInput] = useState(false)

  const handleScroll = () => {
    setShowInput(true) // show the QR/input section
    setTimeout(() => {
      if (!isDesktop && inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100) // short delay to ensure DOM updates before scroll
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

      {!showInput && (
        <motion.p
          className="text-xl text-gray-600 text-center mb-8 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Smart, secure, and efficient indoor car parking guiding system. Navigate your lot with ease.
        </motion.p>
      )}


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

      {/* 👇 Conditionally rendered QR/Input Section */}
      {showInput && (
        <div
          ref={inputRef}
          className="mt-16 w-full flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4"
          >
            {!isDesktop && (
              <div className="w-full text-center text-sm text-gray-500">
                <p className="mb-2">Scan QR Code to Find Your Spot</p>
                <QRCodeScanner />
              </div>
            )}

            <div className="w-full">
            {!isDesktop && (<label className="block text-gray-700 font-semibold mb-2">
                Or enter QR Code Number
              </label>)}
              {isDesktop && (<label className="block text-gray-700 font-semibold mb-2">
                Enter QR Code Number
              </label>)}
              <Input
                type="text"
                placeholder="Enter code here"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
