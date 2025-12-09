'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { examSchema, IExam } from '@/validation/examSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createExamAction } from '../../../../actions/Exam/createExam'

// تعريف نوع الجروب عشان التايب سكريبت
type GroupOption = {
  id: string
  name: string
}

export default function AddExamModal({ groups }: { groups: GroupOption[] }) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      date: new Date(),
      maxScore: 20,
      groupId: '', // بنبدأ فاضي والمستر يختار
    },
  })

  const onSubmit = async (data: IExam) => {
    try {
      const res = await createExamAction(data)

      if (res.success) {
        toast.success(res.message)
        setOpen(false)
        form.reset()
      } else {
        toast.error('حصلت مشكلة')
      }
    } catch (error) {
      console.log(error!)
      toast.error('فشل الاتصال بالسيرفر')
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2'>
          <Plus className='w-4 h-4' />
          إضافة امتحان جديد
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>بيانات الامتحان</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* اختيار المجموعة (الجديد) */}
            <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المجموعة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='اختار المجموعة' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* اسم الامتحان */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الامتحان</FormLabel>
                  <FormControl>
                    <Input placeholder='مثال: امتحان شهر أكتوبر' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* التاريخ والدرجة */}
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>التاريخ</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        {...field}
                        value={
                          field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''
                        }
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maxScore'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>درجة الإمتحان</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        value={(field.value as number) || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className='animate-spin w-4 h-4' /> : 'حفظ الامتحان'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
