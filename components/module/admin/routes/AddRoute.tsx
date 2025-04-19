'use client'

import { useForm, FormProvider, useFieldArray, Controller } from 'react-hook-form'  // Make sure FormProvider is imported
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { ImageSubForm } from '@/components/custom/ImageSubForm'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { Textarea } from '@/components/ui/textarea'
import { FaPhotoVideo } from 'react-icons/fa'
import CustomSelect from "@/components/custom/CustomSelect";

const schema = z.object({
  fromAddress: z.string().min(1, 'From Address is required'),
  toAddress: z.string().min(1, 'To Address is required'),
  toZoneId: z.string().min(1, 'To Zone is required'),
  description: z.string().optional(),
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
    .min(1, 'At least one image is required'),
})

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

export default function AddRoute({ routeData }: { routeData?: any }) {
  const [submitLoading, setSubmitLoading] = useState(false)

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromAddress: routeData?.fromAddress || '',
      toAddress: routeData?.toAddress || '',
      toZoneId: routeData?.toZoneId || '',
      description: routeData?.description || '',
      isActive: routeData?.isActive ?? true,
      images: routeData?.images?.length
        ? routeData.images.map((img: any) => ({
            image: img.image || '',
            title: img.title || '',
            description: img.description || ''
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
      formData.append('fromAddress', data.fromAddress)
      formData.append('toAddress', data.toAddress)
      formData.append('toZoneId', data.toZoneId)
      formData.append('description', data.description || '')
      formData.append('isActive', data.isActive ? 'true' : 'false')

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

      const res = await api.post('/routes/add', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      const result = res.data

      if (!result) {
        throw new Error(result.message || 'Add Route failed')
      }

      toast.success('Route added successfully!')

    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during adding route')
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex items-center justify-center"
    >
      <FormProvider {...methods}>  {/* Pass the whole methods object here */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="bg-gradient-to-br from-white via-gray-100 to-white shadow-xl rounded-2xl p-6 w-full max-w-xl md:max-w-[800px] space-y-4">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Add New Route</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-2/3">
              <label htmlFor="toZoneId" className="block text-sm font-medium text-gray-700">To Zone <span className="text-red-500">*</span></label>
              <Controller
                name="toZoneId" // This should match the field name in your form schema
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
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="fromAddress" className="block text-sm font-medium text-gray-700">From Address <span className="text-red-500">*</span></label>
            <Textarea
              id="fromAddress"
              placeholder="Enter your address..."
              className="min-h-[100px]"
              {...register('fromAddress')}
            />
            {errors.fromAddress && <p className="text-red-500 text-sm">{errors.fromAddress.message}</p>}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <label htmlFor="toAddress" className="block text-sm font-medium text-gray-700">To Address <span className="text-red-500">*</span></label>
            <Textarea
              id="toAddress"
              placeholder="Enter your address..."
              className="min-h-[100px]"
              {...register('toAddress')}
            />
            {errors.toAddress && <p className="text-red-500 text-sm">{errors.toAddress.message}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              id="description"
              placeholder="Enter your description..."
              className="min-h-[100px]"
              {...register('description')}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
                  <ImageSubForm index={index} remove={remove} />
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
          <div className="flex justify-between gap-4 mt-4 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleReset} disabled={submitLoading}>
              Reset Form
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </motion.div>
  )
}
