'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateGroupAction } from '../../../../actions/Group/updateGroup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { daysOfWeek } from '../../../../data/days'
import { grades } from '../../../../data/grades'
import { times } from '../../../../data/times'
import { DayOfWeek, groupSchema, IGroup } from '../../../../validation/groupSchema'

export default function UpdateGroupModal({ groupId }: { groupId: string }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const form = useForm<IGroup>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      schedule: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedule',
  })

  async function onSubmit(data: IGroup) {
    try {
      setLoading(true)
      await updateGroupAction(groupId, data)
      toast.success('تم تعديل المجموعة بنجاح')
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error('Failed')
      throw new Error('Error', error!)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form id={`form-update-group-${groupId}`} onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant={'outline'}>تعديل</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px] '>
            <DialogHeader>
              <DialogTitle className='text-center'>تعديل الطالب</DialogTitle>
              <DialogDescription className='text-center'>قم بتعديل بيانات الطالب</DialogDescription>
            </DialogHeader>
            <div className='space-y-5'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصف الدراسي</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                        <SelectTrigger>
                          <SelectValue placeholder='اختر الصف الدراسي' />
                        </SelectTrigger>

                        <SelectContent className='max-h-60 overflow-auto'>
                          {grades.map((group) => (
                            <div key={group.label} className='py-2'>
                              <div className='px-3 text-sm font-semibold text-muted-foreground'>
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
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-2 items-center'>
                <FormField
                  control={form.control}
                  name={`schedule.${index}.dayOfWeek`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='اختر اليوم' />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`schedule.${index}.startTime`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='وقت البداية' />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label} 
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`schedule.${index}.endTime`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='وقت النهاية' />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Button type='button' onClick={() => remove(index)}>
                  حذف
                </Button>
              </div>
            ))}

            <Button
              type='button'
              onClick={() => append({ dayOfWeek: '' as DayOfWeek, startTime: '', endTime: '' })}
              className='w-fit'
            >
              أضف ميعاد
            </Button>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline'>إلغاء</Button>
              </DialogClose>
              <Button type='submit' form={`form-update-group-${groupId}`} disabled={loading}>
                {loading ? (
                  <span className='animate-spin'>
                    <Loader />
                  </span>
                ) : (
                  'تعديل المجموعة'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  )
}
