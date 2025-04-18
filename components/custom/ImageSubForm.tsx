'use client'

import { useFormContext, FieldErrors } from 'react-hook-form'
import { useImage } from '@/hooks/useImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Dropzone from 'react-dropzone'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Fancybox from '@/components/custom/FancyBox'

interface ImageSubFormProps {
  index: number
  remove: (index: number) => void
  onImageRemove?: (id?: string) => void
}

export function ImageSubForm({ index, remove, onImageRemove }: ImageSubFormProps) {
  const {
    setValue,
    setError,
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const fieldName = `images.${index}.image` as const
  const image = watch(fieldName)
  const imageUrl = watch(`images.${index}.image`)
  const { preview, clearImage, onDrop } = useImage(setValue, setError, fieldName)
  const imageError = (errors?.images as FieldErrors<any>[] | undefined)?.[index]?.image?.message

  const handleRemove = () => {
    if (onImageRemove) {
        const imageId = watch(`images.${index}.id`)
        onImageRemove(imageId)
      }
    clearImage()
    remove(index)
  }

  const showPreview = preview || imageUrl

  return (
    <div className="p-4 bg-gray-50 border rounded-md shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Image {index + 1}</h3>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleRemove}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:block">Remove</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full md:w-3/5 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image <span className="text-red-500">*</span>
          </label>

          <Dropzone
            onDrop={onDrop}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] }}
            maxFiles={1}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-dashed border p-4 text-center cursor-pointer rounded-md bg-white min-h-20 md:min-h-[140px] flex items-center justify-center"
              >
                <input {...getInputProps()} />
                {!showPreview && (
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload an image
                  </p>
                )}

                {/* Show new uploaded preview */}
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mx-auto mt-2 object-cover rounded"
                  />
                )}

                {/* Show saved image preview if no new preview */}
                {!preview && imageUrl && (
                  <Fancybox
                    src={imageUrl}
                    alt="Saved Image"
                    className="w-[100px] h-[100px] object-cover rounded"
                  />
                )}
              </div>
            )}
          </Dropzone>

          {/* Error Message */}
          <AnimatePresence>
            {imageError && (
              <motion.p
                className="text-red-500 text-sm mt-1 text-center"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {(errors.images &&
                    Array.isArray(errors.images) &&
                    errors.images[index]?.image) && (
                        <span className="text-red-500 text-sm">
                        {errors.images[index]?.image?.message?.toString()}
                        </span>
                    )}
              </motion.p>
            )}
          </AnimatePresence>

          {showPreview && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearImage}
              >
                <span className="text-red-500 text-[10px]">Remove Image</span>
              </Button>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/5 space-y-4 mt-4 md:mt-0">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              {...register(`images.${index}.title`)}
              placeholder="Image Title"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              {...register(`images.${index}.description`)}
              placeholder="Image Description"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Include imageUrl in hidden input for backend usage */}
      {imageUrl && (
        <input type="hidden" {...register(`images.${index}.image`)} />
      )}
    </div>
  )
}
