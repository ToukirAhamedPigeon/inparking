'use client'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <>
      {/* hero section */}
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
        Smart, secure, and efficient indoor car parking guiding system. Navigate your lot with ease.
      </motion.p>
    </>
  )
}