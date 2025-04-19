'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { EUserRole, IUser } from '@/types'
import Dropzone from 'react-dropzone'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { checkEmailExists } from '@/lib/helpers'
import { useProfilePicture } from '@/hooks/useProfilePicture'
import { IAllotment } from '@/types'
const schema = z.object({
    slotId: z.string().min(1, 'Slot is required'),
    zoneId: z.string().min(1, 'Zone is required'),
    guestName: z.string().min(1, 'Guest Name is required'),
    guestContactNo: z.string().min(1, 'Guest Contact No is required'),
    guestDetail: z.string().optional(),
    driverName: z.string().optional(),
    driverContactNo: z.string().optional(),
    isOwnerDriver: z.boolean(),
    allotmentFrom: z.string().min(1, 'Allotment From is required'),
    allotmentTo: z.string().min(1, 'Allotment To is required'),
    qrString: z.string().min(1, 'QR String is required'),
    dateTimeFormatId: z.number().min(1, 'Date Time Format is required'),
  })

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

type EditAllotmentFormProps = {
    allotment: IAllotment
    onClose: () => void
    onSuccess: () => void
}

export default function EditAllotmentForm({ allotment, onClose, onSuccess }: EditAllotmentFormProps) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slotId: allotment.slotId.toString(),
      zoneId: allotment.zoneId.toString(), 
      guestName: allotment.guestName,
      guestContactNo: allotment.guestContactNo,
      guestDetail: allotment.guestDetail,
      driverName: allotment.driverName,
      driverContactNo: allotment.driverContactNo,
      isOwnerDriver: allotment.isOwnerDriver,
      allotmentFrom: allotment.allotmentFrom.toISOString(),
      allotmentTo: allotment.allotmentTo.toISOString(),
      qrString: allotment.qrString,
      dateTimeFormatId: allotment.dateTimeFormatId,
    },
  })

  useEffect(() => {
    setValue('slotId', allotment.slotId.toString())
    setValue('zoneId', allotment.zoneId.toString())
    setValue('guestName', allotment.guestName || '')
    setValue('guestContactNo', allotment.guestContactNo || '')
    setValue('guestDetail', allotment.guestDetail || '')
    setValue('driverName', allotment.driverName || '')
    setValue('driverContactNo', allotment.driverContactNo || '')
    setValue('isOwnerDriver', allotment.isOwnerDriver)
    setValue('allotmentFrom', allotment.allotmentFrom.toISOString())
    setValue('allotmentTo', allotment.allotmentTo.toISOString())
    setValue('qrString', allotment.qrString)
    setValue('dateTimeFormatId', allotment.dateTimeFormatId || 0) 
  }, [allotment, setValue])



  const onSubmit = async (data: FormData) => {
    try {
        setSubmitLoading(true)
        const formData = new FormData()
        formData.append('slotId', data.slotId)
        formData.append('zoneId', data.zoneId)
        formData.append('guestName', data.guestName)
        formData.append('guestContactNo', data.guestContactNo)
        formData.append('guestDetail', data.guestDetail || '')
        formData.append('driverName', data.driverName || '')
        formData.append('driverContactNo', data.driverContactNo || '')
        formData.append('isOwnerDriver', data.isOwnerDriver ? 'true' : 'false')
        formData.append('allotmentFrom', data.allotmentFrom)
        formData.append('allotmentTo', data.allotmentTo)
        formData.append('qrString', data.qrString)
        formData.append('dateTimeFormatId', data.dateTimeFormatId.toString())
    
      const res = await api.put(`/allotments/${allotment._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Allotment updated successfully')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update allotment')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       <div className="flex flex-col md:flex-row gap-2">
        {/* Slot Id Field */}
            <div className="w-full md:w-1/2 space-y-1">
                <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">Slot Id <span className="text-red-500">*</span></label>
                <Input id="slotId" placeholder="Slot Id" {...register('slotId')} />
                {errors.slotId && <p className="text-red-500 text-sm">{errors.slotId.message}</p>}
            </div>
          {/* Zone Id Field */}
            <div className="w-full md:w-1/2 space-y-1">
                <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700">Zone Id <span className="text-red-500">*</span></label>
                <div className="relative">
                    <Input
                    id="zoneId"
                    placeholder="Zone Id"
                    {...register('zoneId')}
                    />
                    {errors.zoneId && <p className="text-red-500 text-sm">{errors.zoneId.message}</p>}
                </div>
            </div>
        </div>

        
        <div className="flex flex-col md:flex-row gap-2">
        {/* Guest Name Field */}
        <div className="w-full md:w-1/3 space-y-1">
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Guest Name <span className="text-red-500">*</span></label>
          <Input id="guestName" placeholder="Guest Name" {...register('guestName')} />
          {errors.guestName && <p className="text-red-500 text-sm">{errors.guestName.message}</p>}
        </div>

        {/* Guest Contact No Field */}
        <div className="w-full md:w-1/3 space-y-1">
          <label htmlFor="guestContactNo" className="block text-sm font-medium text-gray-700">Guest Contact No <span className="text-red-500">*</span></label>
          <Input id="guestContactNo" placeholder="Guest Contact No" {...register('guestContactNo')} />
          {errors.guestContactNo && <p className="text-red-500 text-sm">{errors.guestContactNo.message}</p>}
        </div>

        {/* Guest Detail Field */}
        <div className="w-full md:w-1/3 space-y-1">
          <label htmlFor="guestDetail" className="block text-sm font-medium text-gray-700">Guest Detail</label>
          <Input id="guestDetail" placeholder="Guest Detail" {...register('guestDetail')} />
          {errors.guestDetail && <p className="text-red-500 text-sm">{errors.guestDetail.message}</p>}
        </div>
            {/* Driver Name Field */}
            <div className="w-full md:w-1/3 space-y-1">
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Driver Name <span className="text-red-500">*</span></label>
            <Input id="driverName" placeholder="Driver Name" {...register('driverName')} />
            {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName.message}</p>}
        </div>

        {/* Driver Contact No Field */}
        <div className="w-full md:w-1/3 space-y-1">
          <label htmlFor="driverContactNo" className="block text-sm font-medium text-gray-700">Driver Contact No <span className="text-red-500">*</span></label>
          <Input id="driverContactNo" placeholder="Driver Contact No" {...register('driverContactNo')} />
          {errors.driverContactNo && <p className="text-red-500 text-sm">{errors.driverContactNo.message}</p>}
        </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          {/* Is Owner Driver Field */}
          <div className="w-full md:w-1/3 space-y-1">
            <label htmlFor="isOwnerDriver" className="block text-sm font-medium text-gray-700">Is Owner Driver <span className="text-red-500">*</span></label>
            <Input id="isOwnerDriver" placeholder="Is Owner Driver" {...register('isOwnerDriver')} />
            {errors.isOwnerDriver && <p className="text-red-500 text-sm">{errors.isOwnerDriver.message}</p>}
          </div>
          {/* Allotment From Field */}
          <div className="w-full md:w-1/3 space-y-1">
            <label htmlFor="allotmentFrom" className="block text-sm font-medium text-gray-700">Allotment From <span className="text-red-500">*</span></label>
            <Input id="allotmentFrom" placeholder="Allotment From" {...register('allotmentFrom')} />
            {errors.allotmentFrom && <p className="text-red-500 text-sm">{errors.allotmentFrom.message}</p>}
          </div>
          {/* Allotment To Field */}
          <div className="w-full md:w-1/3 space-y-1">
            <label htmlFor="allotmentTo" className="block text-sm font-medium text-gray-700">Allotment To <span className="text-red-500">*</span></label>
            <Input id="allotmentTo" placeholder="Allotment To" {...register('allotmentTo')} />
            {errors.allotmentTo && <p className="text-red-500 text-sm">{errors.allotmentTo.message}</p>}
          </div>
        </div>

      {/* Submit */}
      <hr className="border-t border-gray-200" />
      <div className="flex justify-center">
        <Button variant="warning" type="submit" disabled={isSubmitting || submitLoading}>
          {isSubmitting || submitLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
