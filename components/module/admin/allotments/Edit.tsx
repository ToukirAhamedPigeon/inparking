'use client'

import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { IAllotment } from '@/types'
import { checkAllotmentOverlap } from '@/lib/validations'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import DateTimePicker from '@/components/custom/DateTimePicker'
import CustomSelect from '@/components/custom/CustomSelect'
const schema = z.object({
  _id: z.string().optional(),
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
}).superRefine(async (data, ctx) => {
  console.log(data)
  const hasOverlap = await checkAllotmentOverlap({
    slotId: data.slotId,
    allotment_from: new Date(data.allotmentFrom),
    allotment_to: new Date(data.allotmentTo),
  }, data._id, '_id');
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

type EditAllotmentFormProps = {
    allotmentData: IAllotment
    onClose: () => void
    onSuccess: () => void
}

export default function EditAllotmentForm({ allotmentData, onClose, onSuccess }: EditAllotmentFormProps) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: allotmentData?._id.toString() || '',
      slotId: allotmentData?.slotId?._id.toString() || '',
      zoneId: allotmentData?.zoneId?._id.toString() || '',
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

  useEffect(() => {
    setValue('slotId', allotmentData?.slotId?._id.toString() || '')
    setValue('zoneId', allotmentData?.zoneId?._id.toString() || '')
    setValue('guestName', allotmentData?.guestName || '')
    setValue('guestContactNo', allotmentData?.guestContactNo || '')
    setValue('guestDetail', allotmentData?.guestDetail || '')
    setValue('driverName', allotmentData?.driverName || '')
    setValue('driverContactNo', allotmentData?.driverContactNo || '')
    setValue('isOwnerDriver', allotmentData?.isOwnerDriver)
    setValue('allotmentFrom', allotmentData?.allotmentFrom.toString() || '')
    setValue('allotmentTo', allotmentData?.allotmentTo.toString() || '')
  }, [allotmentData, setValue])



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
        formData.append('allotmentFrom',  data.allotmentFrom)
        formData.append('allotmentTo', data.allotmentTo)
    
      const res = await api.put(`/allotments/${allotmentData._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const onInvalid = (errors: any) => {
    const firstErrorField = Object.keys(errors)?.[0]
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`)
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <FormProvider {...methods}>  {/* Pass the whole methods object here */}
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className=" p-6 w-full max-w-xl md:max-w-[800px] space-y-4">
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
              {errors.guestDetail && <p className="text-red-500 text-sm">{errors.guestDetail.message}</p>}
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
          <div className="flex justify-end gap-4 mt-4 border-t pt-4">
            <Button variant="warning" type="submit" disabled={submitLoading}>
              {submitLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </FormProvider>
  )
}
