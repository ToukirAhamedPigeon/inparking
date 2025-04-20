'use client'

import { useForm, FormProvider, Controller, useWatch } from 'react-hook-form'  // Make sure FormProvider is imported
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import DateTimePicker from '@/components/custom/DateTimePicker'
import { toast } from 'sonner'
import { IAllotment } from '@/types'
import api from '@/lib/axios'
import { Textarea } from '@/components/ui/textarea'
import CustomSelect from "@/components/custom/CustomSelect";
import { Input } from '@/components/ui/input'
import { Checkbox } from "@/components/ui/checkbox";
import { checkAllotmentOverlap } from '@/lib/validations'


const schema = z.object({
  slotId: z.string().min(1, 'Slot is required'),
  zoneId: z.string().min(1, 'Zone is required'),
  guestName: z.string().min(1, 'Guest Name is required'),
  guestContactNo: z.string().min(1, 'Guest Contact No is required'),
  guestDetail: z.string().optional(),
  driverName: z.string().optional(),
  driverContactNo: z.string().optional(),
  isOwnerDriver: z.boolean().optional(),
  allotmentFrom: z.string().min(1, 'Allotment From is required'),
  allotmentTo: z.string().min(1, 'Allotment To is required'), 
  description: z.string().optional(),
  isActive: z.boolean().optional(),
}).superRefine(async (data, ctx) => {
  const hasOverlap = await checkAllotmentOverlap({
    slotId: data.slotId,
    allotment_from: new Date(data.allotmentFrom),
    allotment_to: new Date(data.allotmentTo),
  });

  if (hasOverlap) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['allotmentFrom'],
      message: 'This slot is already allotted during the selected time period.'
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['allotmentTo'],
      message: 'This slot is already allotted during the selected time period.'
    });
  }
})

type FormData = z.infer<typeof schema>

const authUser = localStorage.getItem('authUser')
const token = JSON.parse(authUser || '{}').token

export default function AddAllotment({ allotmentData }: { allotmentData?: IAllotment }) {
  const [submitLoading, setSubmitLoading] = useState(false)

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slotId: allotmentData?.slotId?.toString() || '',
      zoneId: allotmentData?.zoneId?.toString() || '',
      guestName: allotmentData?.guestName || '',
      guestContactNo: allotmentData?.guestContactNo || '',
      guestDetail: allotmentData?.guestDetail || '',
      driverName: allotmentData?.driverName || '',
      driverContactNo: allotmentData?.driverContactNo || '',
      isOwnerDriver: allotmentData?.isOwnerDriver ?? false,
      allotmentFrom: allotmentData?.allotmentFrom.toString() || '',
      allotmentTo: allotmentData?.allotmentTo.toString() || '',
    }
  })
  
  const { control, watch, register, setValue, handleSubmit, reset, formState: { errors } } = methods
  
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

      const res = await api.post('/allotments/add', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = res.data

      if (!result) {
        throw new Error(result.message || 'Add Allotment failed')
      }

      toast.success('Allotment added successfully!')

    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during adding allotment')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Reset Handler
  const handleReset = () => {
    reset()
  }

  const isOwnerDriver = useWatch({ control, name: 'isOwnerDriver' });
  const guestName = useWatch({ control, name: 'guestName' });
  const guestContactNo = useWatch({ control, name: 'guestContactNo' });

  useEffect(() => {
    if (isOwnerDriver) {
      setValue('driverName', guestName || '');
      setValue('driverContactNo', guestContactNo || '');
    }
  }, [isOwnerDriver, guestName, guestContactNo, setValue]);
  
  useEffect(() => {
    if (!isOwnerDriver) {
      setValue('driverName', '');
      setValue('driverContactNo', '');
    }
  }, [isOwnerDriver, setValue]);

  const zoneId = useWatch({ control, name: 'zoneId' })
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex items-center justify-center"
    >
      <FormProvider {...methods}>  {/* Pass the whole methods object here */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="bg-gradient-to-br from-white via-gray-100 to-white shadow-xl rounded-2xl p-6 w-full max-w-xl md:max-w-[800px] space-y-4">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Slot Allotment</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-1/2">
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
                      <p className="text-red-500 text-sm">{fieldState?.error && 'Zone is required'}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">Slot <span className="text-red-500">*</span></label>
              <Controller
                name="slotId" // This should match the field name in your form schema
                render={({ field, fieldState }) => (
                  <>
                    <CustomSelect
                      value={field.value}
                      onChange={field.onChange}
                      apiUrl="/slots/search"
                      filter={zoneId ? { zoneId: zoneId } : {}} // optional filters like { parentLotId: "123" }
                      multiple={false} // or true for multi-select
                      optionValueKey="_id"
                      optionLabelKeys={["slotNumber"]}
                      optionLabelSeparator=" "
                      placeholder="Select Slot"
                    />
                    {/* Error handling */}
                    {fieldState?.error && (
                      <p className="text-red-500 text-sm">{fieldState?.error && 'Slot is required'}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="allotmentFrom" className="block text-sm font-medium text-gray-700">
                Allotment From <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="allotmentFrom"
                render={({ field }) => (
                  <DateTimePicker
                    selectedDate={field.value ? new Date(field.value) : new Date()}
                    onChange={(date) => field.onChange(date?.toString())}
                    className="w-full"
                  />
                )}
              />
              {errors.allotmentFrom && <p className="text-red-500 text-sm">{errors.allotmentFrom.message}</p>}
            </div>

            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="allotmentTo" className="block text-sm font-medium text-gray-700">
                Allotment To <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="allotmentTo"
                render={({ field }) => (
                  <DateTimePicker
                  selectedDate={
                    field.value
                      ? new Date(field.value)
                      : (() => {
                          const now = new Date();
                          now.setHours(23, 45, 0, 0); // Set to 23:59:00
                          return now;
                        })()
                  }
                    onChange={(date) => field.onChange(date?.toString())}
                  />
                )}
              />
              {errors.allotmentTo && <p className="text-red-500 text-sm">{errors.allotmentTo.message}</p>}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">Guest Name <span className="text-red-500">*</span></label>
              <Input id="guestName" placeholder="Guest Name" {...register('guestName')} />
            {errors.guestName && <p className="text-red-500 text-sm">{errors.guestName.message}</p>}
            </div>
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="guestContactNo" className="block text-sm font-medium text-gray-700">Guest Contact No <span className="text-red-500">*</span></label>
              <Input id="guestContactNo" placeholder="Guest Contact No" {...register('guestContactNo')} />
            {errors.guestContactNo && <p className="text-red-500 text-sm">{errors.guestContactNo.message}</p>}
            </div>
          </div>
            
            <div className="space-y-1 flex-1 min-w-[200px]">
              <div className="flex flex-row justify-between">
              <label htmlFor="guestDetail" className="block text-sm font-medium text-gray-700">Guest Detail</label>
              <div className="flex items-center cursor-pointer py-1 px-2 border border-gray-300 bg-gray-100 hover:bg-gray-50 rounded-md">
                <Controller
                  name="isOwnerDriver"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="isOwnerDriver"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="isOwnerDriver" className=" ml-2 text-sm text-gray-700 cursor-pointer">
                        Guest is Driver
                      </label>
                    </>
                  )}
                />
              </div>      
              </div>    
              <Textarea
                id="guestDetail"
                placeholder="Enter your guest detail..."
                className="min-h-[100px]"
                {...register('guestDetail')}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            

          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="driverName" className="block text-sm font-medium text-gray-700">Driver Name <span className="text-red-500">*</span></label>
              <Input id="driverName" placeholder="Driver Name" readOnly={isOwnerDriver} {...register('driverName')} />
            {errors.driverName && <p className="text-red-500 text-sm">{errors.driverName.message}</p>}
            </div>
            <div className="space-y-1 w-full md:w-1/2">
              <label htmlFor="driverContactNo" className="block text-sm font-medium text-gray-700">Driver Contact No <span className="text-red-500">*</span></label>
              <Input id="driverContactNo" placeholder="Driver Contact No" readOnly={isOwnerDriver} {...register('driverContactNo')} />
            {errors.driverContactNo && <p className="text-red-500 text-sm">{errors.driverContactNo.message}</p>}
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
