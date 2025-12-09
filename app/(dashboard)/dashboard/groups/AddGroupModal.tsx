'use client'

import { addGroupAction } from '@/actions/Group/addGroup'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { daysOfWeek } from '@/data/days'
import { grades } from '@/data/grades'
import { times } from '@/data/times'
import { groupSchema, IGroupInput } from '@/validation/groupSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, PlusCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function AddGroupModal() {
  const [open, setOpen] = useState(false)

  // 1. هنا بنحدد النوع <IGroupInput> عشان التايب سكريبت يشوف schedule
  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      price: 0,
      paymentType: 'PER_SESSION',
      schedule: [], // دلوقتي التايب سكريبت عارف إن دي موجودة
    },
  })

  // 2. الـ control دلوقتي بقى عارف schedule فمش هيضرب إيرور
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  })

  async function onSubmit(data: IGroupInput) {
    try {
      console.log(data)
      const res = await addGroupAction(data)
      if (res.success) {
        toast.success('تم إضافة المجموعة بنجاح')
        setOpen(false)
        form.reset()
      } else {
        toast.error(res.message)
      }
    } catch (error) {
      console.log(error!)
      toast.error('حدث خطأ غير متوقع')
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2'>
          <PlusCircle className='w-4 h-4' />
          أضف مجموعة
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-center'>إضافة مجموعة جديدة</DialogTitle>
          <DialogDescription className='text-center'>
            أدخل بيانات المجموعة ونظام الدفع والمواعيد
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id='form-add-group' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* اختيار الصف */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الصف الدراسي</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر الصف الدراسي' />
                      </SelectTrigger>
                      <SelectContent className='max-h-[200px]'>
                        {grades.map((group) => (
                          <div key={group.label}>
                            <div className='px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50'>
                              {group.label}
                            </div>
                            {group.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* نظام الدفع والسعر */}
            <div className='flex justify-start gap-10'>
              <FormField
                control={form.control}
                name='paymentType'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>نظام الدفع</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-col space-y-1'
                      >
                        <FormItem className='flex items-center space-x-3 space-x-reverse  space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='PER_SESSION' />
                          </FormControl>
                          <FormLabel className='font-normal cursor-pointer'>بالحصة</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-3 space-x-reverse  space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='MONTHLY' />
                          </FormControl>
                          <FormLabel className='font-normal cursor-pointer'>بالشهر</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>قيمة الاشتراك / الحصة</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='number'
                          {...field}
                          className='pl-10'
                          // التأكد من إن القيمة رقم دايماً
                          value={typeof field.value === 'number' ? field.value : ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <span className='absolute left-3 top-2.5 text-sm text-muted-foreground'>
                          ج.م
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* المواعيد */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <FormLabel>المواعيد الأسبوعية</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ dayOfWeek: 'SATURDAY', startTime: '', endTime: '' })}
                  className='gap-2'
                >
                  <Plus className='w-3 h-3' />
                  أضف ميعاد
                </Button>
              </div>

              <div className='space-y-3'>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='flex gap-2 items-start p-3 bg-muted/20 rounded-lg border'
                  >
                    <div className='grid grid-cols-3 gap-2 flex-1'>
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.dayOfWeek`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='اليوم' />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.map((d) => (
                                  <SelectItem key={d.value} value={d.value}>
                                    {d.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`schedule.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='من' />
                              </SelectTrigger>
                              <SelectContent>
                                {times.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`schedule.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9'>
                                <SelectValue placeholder='إلى' />
                              </SelectTrigger>
                              <SelectContent>
                                {times.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 shrink-0'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                ))}

                {fields.length === 0 && (
                  <p className='text-sm text-muted-foreground text-center py-4 bg-muted/10 rounded-md border border-dashed'>
                    لا توجد مواعيد مضافة
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className='gap-2 sm:gap-0'>
              <DialogClose asChild>
                <Button variant='outline' type='button'>
                  إلغاء
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className='animate-spin w-4 h-4' /> : 'حفظ المجموعة'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
