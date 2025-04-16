import React from 'react'
import { motion } from 'framer-motion'
import { formatDateTime } from '@/lib/formatDate'
import Image from 'next/image'
type ModalProps = {
  isOpen: boolean
  onClose: () => void
  user: any
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
          User Details
        </div>


        {/* User Info and Profile Picture */}
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Picture */}
           <div className="lg:w-1/3 w-full flex justify-center items-center">
            <Image
                src={user.profilePictureUrl}
                alt="Profile"
                className="object-cover rounded-xl border-2 border-white"
                width={200}
                height={200}
            />
            </div>
          {/* User Info */}
          <div className="flex-1 space-y-4">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {<span className='capitalize'>{user.role}</span>}</p>
            <p><strong>Status:</strong> {user.isActive ? <span className='text-green-500 font-bold'>Active</span> : <span className='text-red-500 font-bold'>Inactive</span>}</p>
            <p><strong>Created At:</strong> {formatDateTime(user.createdAt)}</p>
            <p><strong>Updated At:</strong> {formatDateTime(user.updatedAt)}</p>
          </div>

        </div>

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
