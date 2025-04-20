'use client'

import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form'  // Make sure FormProvider is imported
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
import { ISlot } from '@/types'
import CustomSelect from '@/components/custom/CustomSelect'

const schema = z.object({
  slotNumber: z.string().min(1, 'Slot Number is required'),
  slotDetail: z.string().min(1, 'Slot Detail is required'),
  isActive: z.boolean().optional(),
  zoneId: z.string().optional(),
  images: z
    .array(
      z.object({
        id: z.string().optional(),
        image: z
          .custom<File | string>((val) => val instanceof File || typeof val === 'string', {
            message: 'Image is required',
          }),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .min(1, 'At least one image is required'),
})

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

export default function EditSlot({ slotData, onClose, onSuccess }: { slotData?: ISlot, onClose: () => void, onSuccess: () => void }) {
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
      slotNumber: slotData?.slotNumber || '',
      slotDetail: slotData?.slotDetail || '',
      isActive: slotData?.isActive ?? true,
      zoneId: slotData?.zoneId?._id.toString() || '',
      images: slotData?.images?.length
        ? slotData.images.map((img: any) => ({
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
      formData.append('slotNumber', data.slotNumber)
      formData.append('slotDetail', data.slotDetail)
      formData.append('zoneId', data.zoneId || '')
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

      const res = await api.put(`/slots/${slotData?._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const result = res.data

      if (!result) {
        throw new Error(result.message || 'Add Slot failed')
      }

      toast.success(`Slot "${slotData?.slotNumber}" updated successfully!`)
      onSuccess()

    } catch (error: any) {
          toast.error(error.message || 'Something went wrong during updating slot')
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
            <label htmlFor="slotNumber" className="block text-sm font-medium text-gray-700">Slot Number <span className="text-red-500">*</span></label>
            <Input id="slotNumber" placeholder="Slot Number" {...register('slotNumber')} />
            {errors.slotNumber && <p className="text-red-500 text-sm">{errors.slotNumber.message}</p>}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-2/3">
              <label htmlFor="zoneId" className="block text-sm font-medium text-gray-700">Zone <span className="text-red-500">*</span></label>
              <Controller
                    name="zoneId" // This should match the field name in your form schema
                    render={({ field, fieldState }) => (
                      <>
                        <CustomSelect
                          value={field.value}
                          onChange={field.onChange}
                          apiUrl="/zones/search"
                          filter={{}} // optional filters like { parentLotId: "123" }
                          multiple={false} // or true for multi-select
                          optionValueKey="_id"
                          optionLabelKeys={["name", "address"]}
                          optionLabelSeparator=", "
                          placeholder="Select Zone"
                        />
                        {/* Error handling */}
                        {fieldState?.error && (
                          <p className="text-red-500 text-sm">{fieldState?.error && 'To Zone is required'}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="space-y-1 w-full md:w-1/3">
                    <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
                    <Select
                      defaultValue={'active'}
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
              </div>
          {/* Slot Detail Field */}
          <div className="space-y-1"> 
            <label htmlFor="slotDetail" className="block text-sm font-medium text-gray-700">Slot Detail <span className="text-red-500">*</span></label>
            <Textarea
              id="slotDetail"
              placeholder="Enter your slot detail..."
              className="min-h-[100px]"
              {...register('slotDetail')}
            />
            {errors.slotDetail && <p className="text-red-500 text-sm">{errors.slotDetail.message}</p>}
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
