'use client'

import { useForm, FormProvider, useFieldArray } from 'react-hook-form'  // Make sure FormProvider is imported
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ImageSubForm } from '@/components/custom/ImageSubForm'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Textarea } from '@/components/ui/textarea'
import { FaPhotoVideo } from 'react-icons/fa'
import { IZone } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  contactName: z.string().optional(),
  contactNo: z.string().optional(),
  isActive: z.boolean().optional(),
  images: z
  .array(
    z.object({
      image: z
        .custom<File | string>((val) => val instanceof File || typeof val === 'string', {
          message: 'Image is required',
        }),
      title: z.string().optional(),
      description: z.string().optional(),
    })
  )
  .refine((val) => val.length === 0 || val.every((img) => img.image), {
    message: 'Image is required for each image entry',
  }),
})

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

export default function EditZone({ zoneData, onClose, onSuccess }: { zoneData?: IZone, onClose: () => void, onSuccess: () => void }) {
const [submitLoading, setSubmitLoading] = useState(false)
const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])

const handleRemoveImage = (index: number) => {
  const currentImage = images[index]
  const id = (currentImage as any).id

  // Correctly generate preview
  let previewUrl: string | null = null
  if (typeof currentImage.image === 'string') {
    previewUrl = currentImage.image
  } else if (currentImage.image instanceof File) {
    previewUrl = URL.createObjectURL(currentImage.image)
  }
  remove(index)
}

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: zoneData?.name || '',
      address: zoneData?.address || '',
      latitude: zoneData?.latitude || '',
      longitude: zoneData?.longitude || '',
      contactName: zoneData?.contactName || '',
      contactNo: zoneData?.contactNo || '',
      isActive: zoneData?.isActive ?? true,
      images: zoneData?.images?.length
        ? zoneData.images.map((img: any) => ({
            id: img._id,
            image: img.imageUrl || '',
            title: img.imageTitle || '',
            description: img.imageDetail || ''
          }))
        : [],
    }
  })
  
  const { control, watch, register, setValue, handleSubmit, reset, formState: { errors } } = methods
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images'
  })

  const images = watch('images')

  const onInvalid = (errors: any) => {
    const firstErrorField = Object.keys(errors)?.[0]
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Form Submit
  const onSubmit = async (data: FormData) => {
    setSubmitLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('address', data.address)
      formData.append('latitude', data.latitude || '')
      formData.append('longitude', data.longitude || '')
      formData.append('contactName', data.contactName || '')
      formData.append('contactNo', data.contactNo || '')
      formData.append('isActive', data.isActive ? 'true' : 'false')
      formData.append('deletedImageIds', JSON.stringify(deletedImageIds))

      data.images.forEach((img, index) => {
        if (img.image) {
          formData.append(`images[${index}]`, img.image)
        }
        if (img.title) {
          formData.append(`images[${index}].title`, img.title)
        }
        if (img.description) {
          formData.append(`images[${index}].description`, img.description)
        }
      })

      const res = await api.put(`/zones/${zoneData?._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const result = res.data

      if (!result) {
        throw new Error(result.message || 'Add Zone failed')
      }

      toast.success(`Zone "${zoneData?.name}" updated successfully!`)
      onSuccess()

    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during updating zone')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Reset Handler
  const handleReset = () => {
    reset()
  }

  // Add Image Subform dynamically
  const addImageSubForm = () => {
    append({ image: '', title: '', description: '' })
  }

  // Handle Image Remove
  const handleImageRemove = (id?: string) => {
    if (id) {
      setDeletedImageIds((prev) => [...prev, id])
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex items-center justify-center"
    >
      <FormProvider {...methods}>  {/* Pass the whole methods object here */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className=" p-6 w-full max-w-xl md:max-w-[800px] space-y-4">

          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
            <Input id="name" placeholder="Name" {...register('name')} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address <span className="text-red-500">*</span></label>
            <Textarea
              id="address"
              placeholder="Enter your address..."
              className="min-h-[100px]"
              {...register('address')}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
          </div>

          {/* Latitude and Longitude */}
          <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-1 w-full md:w-1/3">
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
              <Select
                defaultValue={zoneData?.isActive ? 'active' : 'inactive'}
                onValueChange={(val) => setValue('isActive', val === 'active')}
              >
                <SelectTrigger id="isActive">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.isActive && <p className="text-red-500 text-sm">{errors.isActive.message}</p>}
            </div>
            <div className="space-y-1 w-full md:w-1/3">
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
              <Input type="text" id="latitude" placeholder="Latitude" {...register('latitude')} />
              {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude.message}</p>}
            </div>
            <div className="space-y-1 w-full md:w-1/3">
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
              <Input type="text" id="longitude" placeholder="Longitude" {...register('longitude')} />
              {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude.message}</p>}
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
              <Input type="text" id="contactName" placeholder="Contact Name" {...register('contactName')} />
              {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName.message}</p>}
            </div>

            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">Contact No</label>
              <Input type="text" id="contactNo" placeholder="Contact No" {...register('contactNo')} />
              {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo.message}</p>}
            </div>
          </div>

          {/* Image Subform (dynamic images) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Images</h3>
            {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ImageSubForm index={index} remove={()=>handleRemoveImage(index)} onImageRemove={handleImageRemove}/>
                </motion.div>
              ))}
              {errors.images?.message && (
                  <span className="text-red-500 text-sm text-center block">
                      {(errors.images?.message as string) || 'At least one image is required.'}
                  </span>
              )}
              <div className="flex justify-center md:justify-end">
                <Button type="button" variant="info" onClick={addImageSubForm}>
                  <FaPhotoVideo className="w-4 h-4 mr-2" /> Add Image
                </Button>
              </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-4 border-t pt-4">
            <Button variant="warning" type="submit" className=" text-white" disabled={submitLoading}>
              {submitLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </motion.div>
  )
}
