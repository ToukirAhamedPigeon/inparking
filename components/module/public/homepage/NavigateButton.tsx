'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function NavigateButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <Button
          className="text-lg px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition"
          onClick={onClick}
        >
          Navigate to Parking Lot
        </Button>
      </motion.div>
  )
}