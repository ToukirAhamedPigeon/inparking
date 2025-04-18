import { useState, useCallback } from 'react'
import { FieldValues, UseFormSetValue, UseFormSetError, Path, PathValue } from 'react-hook-form'

export function useImage<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  setError: UseFormSetError<T>,
  fieldName: Path<T>
) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isImageDeleted, setIsImageDeleted] = useState(false)

  // Clear image data
  const clearImage = useCallback(() => {
    setValue(fieldName, undefined as PathValue<T, Path<T>>) // Clear the field value
    setPreview(null)
    setError(fieldName, { message: '' })
    setIsImageDeleted(true)
  }, [setValue, setError, fieldName])

  // Handle file drop for image upload
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setValue(fieldName, undefined as PathValue<T, Path<T>>) // Reset field value
      setPreview(null)
      setError(fieldName, { message: '' })

      const file = acceptedFiles[0]
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      const maxSize = 50 * 1024 * 1024

      if (fileRejections.length > 0 || !file || !validTypes.includes(file.type) || file.size > maxSize) {
        setError(fieldName, {
          type: 'manual',
          message: 'File must be a valid image and less than 5MB.',
        })
        return
      }

      setValue(fieldName, file as PathValue<T, Path<T>>) // Set the uploaded image as the value
      setPreview(URL.createObjectURL(file))
      setIsImageDeleted(true)
    },
    [setValue, setError, fieldName]
  )

  return {
    preview,
    isImageDeleted,
    clearImage,
    onDrop,
    setIsImageDeleted,
    setPreview,
  }
}
