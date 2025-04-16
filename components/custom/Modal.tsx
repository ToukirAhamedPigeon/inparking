import React from 'react'
import { motion } from 'framer-motion'
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose} // Close on clicking outside
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-t from-[#fdfbfb] via-white to-[#ebedee] p-8 rounded-lg w-full max-w-4xl flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Title */}
        <div className="text-2xl font-semibold text-gray-800 mb-6">
          {title}
        </div>

       {children}

        {/* Footer with Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Modal
