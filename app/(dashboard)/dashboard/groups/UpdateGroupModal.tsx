'use client'

import { updateGroupAction } from '@/actions/Group/updateGroup'
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
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { IGroupDB } from '../../../../interfaces/groups'



export default function UpdateGroupModal({ group }: { group: IGroupDB }) {
  const [open, setOpen] = useState(false)

  // 1. إعداد الفورم بالبيانات القديمة
  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group.name,
      price: group.price,
      paymentType: group.paymentType,
      // لازم نتأكد إن المواعيد جاية مصفوفة حتى لو فاضية
      schedule: group.schedule || [],
    },
  })

  // 2. ربط الـ FieldArray
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  })

  async function onSubmit(values: IGroupInput) {
    const res = await updateGroupAction(group.id, values)
    if (res.success) {
      toast.success(res.message)
      setOpen(false)
    } else {
      toast.error(res.message)
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='secondary'
        >
          <Edit className='w-4 h-4' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>تعديل المجموعة</DialogTitle>
          <DialogDescription>تعديل البيانات الأساسية والمواعيد</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* 1. اختيار الصف (Select) */}
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
                        {grades.map((g) => (
                          <div key={g.label}>
                            <div className='px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50'>
                              {g.label}
                            </div>
                            {g.options.map((option) => (
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

            {/* 2. نظام الدفع والسعر */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                        <FormItem className='flex items-center space-x-3 space-x-reverse space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='PER_SESSION' />
                          </FormControl>
                          <FormLabel className='font-normal cursor-pointer'>بالحصة</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-3 space-x-reverse space-y-0'>
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
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type='number'
                          {...field}
                          className='pl-10'
                          value={field.value as number}
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

            {/* 3. المواعيد (Editable Table) */}
            <div className='space-y-4 border-t pt-4'>
              <div className='flex items-center justify-between'>
                <FormLabel className='text-base font-semibold'>المواعيد</FormLabel>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    append({ dayOfWeek: 'SATURDAY', startTime: '12:00', endTime: '14:00' })
                  }
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
                      {/* اليوم */}
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.dayOfWeek`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9 bg-background'>
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

                      {/* من */}
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9 bg-background'>
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

                      {/* إلى */}
                      <FormField
                        control={form.control}
                        name={`schedule.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem className='space-y-0'>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='h-9 bg-background'>
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
                  <div className='text-sm text-muted-foreground text-center py-6 bg-muted/10 rounded-md border border-dashed'>
                    لا توجد مواعيد
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className='gap-2 sm:gap-0 pt-4'>
              <DialogClose asChild>
                <Button variant='outline' type='button'>
                  إلغاء
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className='animate-spin w-4 h-4' /> : 'حفظ التعديلات'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
