'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function CarAnimation() {
  return (
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
  )
}