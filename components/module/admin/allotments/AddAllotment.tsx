'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import Dropzone from 'react-dropzone'
import Image from 'next/image'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useState } from 'react'
import { EUserRole } from '@/types'

const schema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  zoneId: z.string().min(1, 'Zone is required'),
  guestName: z.string().optional(),
  guestContactNo: z.string().optional(),
  guestDetail: z.string().optional(),
  driverName: z.string().optional(),
  driverContactNo: z.string().optional(),
  isOwnerDriver: z.boolean().optional(),
  allotmentFrom: z.string().min(1, 'Allotment From is required'),
  allotmentTo: z.string().min(1, 'Allotment To is required'),
  qrString: z.string().min(1, 'QR String is required'),
  dateTimeFormatId: z.number().optional(),
})

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

export default function Register() {
  const [submitLoading, setSubmitLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slotId: '',
      zoneId: '',
      guestName: '',
      guestContactNo: '',
      guestDetail: '',
      driverName: '',
      driverContactNo: '',
      isOwnerDriver: false,
      allotmentFrom: '',
      allotmentTo: '',
      qrString: '',
      dateTimeFormatId: undefined
    }
  })

  // Form Submit
  const onSubmit = async (data: FormData) => {
    // Check if email already exists
    setSubmitLoading(true)
  
    try {
      const formData = new FormData()
      formData.append('slotId', data.slotId)
      formData.append('zoneId', data.zoneId)
      formData.append('guestName', data.guestName || '')
      formData.append('guestContactNo', data.guestContactNo || '')
      formData.append('guestDetail', data.guestDetail || '')
      formData.append('driverName', data.driverName || '')
      formData.append('driverContactNo', data.driverContactNo || '') 
      formData.append('isOwnerDriver', data.isOwnerDriver ? 'true' : 'false')
      formData.append('allotmentFrom', data.allotmentFrom)
      formData.append('allotmentTo', data.allotmentTo)
      formData.append('qrString', data.qrString)
      formData.append('dateTimeFormatId', data.dateTimeFormatId?.toString() || '')

      const res = await api.post('/api/allotments/add', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
  
      const result = res.data
  
      if (!result) {
        // Backend returns a message for display on error
        throw new Error(result.message || 'Registration failed')
      }
  
      // Optionally: show toast or success message
      toast.success('Allotment created successfully!')
  
      // Reset form
      //handleReset()
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during allotment creation')
    } finally {
      setSubmitLoading(false)
    }
  }
  

  // Reset Handler
  const handleReset = () => {
    reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex items-center justify-center"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-white via-gray-100 to-white shadow-xl rounded-2xl p-6 w-full max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Register New User</h2>

        {/* Slot Field */}
        <div className="space-y-1">
          <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">Slot <span className="text-red-500">*</span></label>
          <Input id="slotId" placeholder="Slot" {...register('slotId')} />
          {errors.slotId && <p className="text-red-500 text-sm">{errors.slotId.message}</p>}
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700">Zone <span className="text-red-500">*</span></label>
          <Select defaultValue={EUserRole.ADMIN} onValueChange={(val) => setValue('zoneId', val as EUserRole)}>
            <SelectTrigger id="zoneId">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EUserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={EUserRole.USER}>User</SelectItem>
              <SelectItem value={EUserRole.DEVELOPER}>Developer</SelectItem>
            </SelectContent>
          </Select>
          {errors.zoneId && <p className="text-red-500 text-sm">{errors.zoneId.message}</p>}
        </div>

        {/* Allotment From */}
        <div className="space-y-1">
          <label htmlFor="allotmentFrom" className="block text-sm font-medium text-gray-700">Allotment From <span className="text-red-500">*</span></label>
          <Input id="allotmentFrom" placeholder="Allotment From" {...register('allotmentFrom')} />
            {errors.allotmentFrom && <p className="text-red-500 text-sm">{errors.allotmentFrom.message}</p>}
          </div>

        {/* Allotment To */}
        <div className="space-y-1">
          <label htmlFor="allotmentTo" className="block text-sm font-medium text-gray-700">Allotment To <span className="text-red-500">*</span></label>
          <Input id="allotmentTo" placeholder="Allotment To" {...register('allotmentTo')} />
            {errors.allotmentTo && <p className="text-red-500 text-sm">{errors.allotmentTo.message}</p>}
          </div>

        {/* QR String */}
        <div className="space-y-1">
          <label htmlFor="qrString" className="block text-sm font-medium text-gray-700">QR String <span className="text-red-500">*</span></label>
          <Input id="qrString" placeholder="QR String" {...register('qrString')} />
            {errors.qrString && <p className="text-red-500 text-sm">{errors.qrString.message}</p>}
          </div>

        {/* Date Time Format */}
        <div className="space-y-1">
          <label htmlFor="dateTimeFormatId" className="block text-sm font-medium text-gray-700">Date Time Format <span className="text-red-500">*</span></label>
            <Input id="dateTimeFormatId" placeholder="Date Time Format" {...register('dateTimeFormatId')} />
            {errors.dateTimeFormatId && <p className="text-red-500 text-sm">{errors.dateTimeFormatId.message}</p>}
          </div>

        {/* Guest Name */}
        <div className="space-y-1">
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Guest Name <span className="text-red-500">*</span></label>
          <Input id="guestName" placeholder="Guest Name" {...register('guestName')} />
            {errors.guestName && <p className="text-red-500 text-sm">{errors.guestName.message}</p>}
          </div>

        {/* Guest Contact No */}
        <div className="space-y-1">
          <label htmlFor="guestContactNo" className="block text-sm font-medium text-gray-700">Guest Contact No <span className="text-red-500">*</span></label>
          <Input id="guestContactNo" placeholder="Guest Contact No" {...register('guestContactNo')} />
            {errors.guestContactNo && <p className="text-red-500 text-sm">{errors.guestContactNo.message}</p>}
          </div>

        {/* Guest Detail */}
        <div className="space-y-1">
          <label htmlFor="guestDetail" className="block text-sm font-medium text-gray-700">Guest Detail</label>
          <Input id="guestDetail" placeholder="Guest Detail" {...register('guestDetail')} />
            {errors.guestDetail && <p className="text-red-500 text-sm">{errors.guestDetail.message}</p>}
          </div>

        {/* Driver Name */}
        <div className="space-y-1">
          <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Driver Name</label>
          <Input id="driverName" placeholder="Driver Name" {...register('driverName')} />
            {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName.message}</p>}
          </div>

        {/* Driver Contact No */}
        <div className="space-y-1">
          <label htmlFor="driverContactNo" className="block text-sm font-medium text-gray-700">Driver Contact No</label>
          <Input id="driverContactNo" placeholder="Driver Contact No" {...register('driverContactNo')} />
            {errors.driverContactNo && <p className="text-red-500 text-sm">{errors.driverContactNo.message}</p>}
          </div>  

        {/* Is Owner Driver */}
        <div className="space-y-1">
          <label htmlFor="isOwnerDriver" className="block text-sm font-medium text-gray-700">Is Owner Driver</label>
          <Input id="isOwnerDriver" placeholder="Is Owner Driver" {...register('isOwnerDriver')} />
            {errors.isOwnerDriver && <p className="text-red-500 text-sm">{errors.isOwnerDriver.message}</p>}
          </div>

        {/* Actions */}
        <div className="flex justify-between gap-4 mt-4 border-t pt-4">
          <Button type="button" variant="outline" onClick={handleReset} disabled={submitLoading}>
            Reset Form
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={submitLoading}>
            {submitLoading ? 'Registering...' : 'Register User'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
