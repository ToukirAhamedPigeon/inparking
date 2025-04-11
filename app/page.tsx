'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-blue-700 text-center mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to InParking
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 text-center mb-8 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Smart, secure, and efficient indoor car parking guiding system. Navigate your lot with ease.
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
        <Link href="/auth/signin">
          <Button className="text-lg px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </main>
  )
}
