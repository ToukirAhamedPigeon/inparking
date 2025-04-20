'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useMediaQuery } from 'usehooks-ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import QrScanner from '@/components/custom/QRCodeScanner'
import { useState } from 'react'

export default function InputSection({ showInput, inputRef, showScanner, onScan, onSubmit, onRetry }: {
  showInput: boolean,
  inputRef: React.RefObject<HTMLDivElement>,
  showScanner: boolean,
  onScan: (val: string) => void,
  onSubmit: (val: string) => void,
  onRetry: () => void
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
    }
  }

  return (
    <div className='w-full min-h-[200px]'>
        <AnimatePresence>
        {showInput && (
          <motion.div
            key="inputSection"
            ref={inputRef}
            className="mt-16 w-full flex justify-center items-center mb-[20px]"
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
              {showScanner && (
                <div className="w-full text-center text-sm text-gray-500">
                  <p className="mb-2">Scan QR Code to Find Your Spot</p>
                  <div style={{ maxHeight: '250px', overflow: 'hidden' }}>
                    <QrScanner onScan={(val) => {onScan(val); setInputValue(val)}} />
                  </div>
                </div>
              )}

              {!showScanner && (
                <Button
                  onClick={onRetry}
                  className="text-sm px-4 py-2 mt-2"
                >
                  Scan Again
                </Button>
              )}

            <div className="w-full space-y-2">
                <label className="block text-gray-700 font-semibold text-center">
                    {isDesktop ? "Enter QR Code Number" : "Or enter QR Code Number"}
                </label>
                <Input
                    type="text"
                    placeholder="Enter code here"
                    className="w-full text-center"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                    onClick={handleSubmit}
                    className="w-full mt-2"
                    disabled={!inputValue.trim()}
                >
                    Submit
                </Button>
                </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
  )
}
