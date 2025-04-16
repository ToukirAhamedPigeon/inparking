'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UnauthorizedPage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-xl border">
        <div className="flex items-center justify-center mb-6 text-red-500">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link href="/">
          <Button variant="outline">Go back home</Button>
        </Link>
      </div>
    </motion.div>
  )
}
