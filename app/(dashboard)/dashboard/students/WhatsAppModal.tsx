'use client'

import { zodResolver } from '@hookform/resolvers/zod' // لو شغال بـ zod
import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// استدعاءات shadcn (تأكد إنك مسطبهم)
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea'
import { Student } from '@prisma/client'

// 1. السكيما البسيطة (عشان الـ Validation يبقى شيك)
const formSchema = z.object({
  message: z.string().min(1, {
    message: 'اكتب أي كلمة',
  }),
})

export function WhatsAppDialog({ student }: { student: Student }) {
  // بنحتاج state داخلي بس عشان نقفل المودال لما يبعت
  const [open, setOpen] = useState(false)

  // 2. تعريف الفورم
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  // 3. دالة الإرسال
  function onSubmit(values: z.infer<typeof formSchema>) {
    const domain = window.location.origin
    const link = `${domain}/student/${student.studentCode}`

    // تظبيط رقم التليفون (يشيل الصفر ويحط 20)
    let phone = student.parentPhone || ''
    if (phone.startsWith('0')) phone = phone.substring(1)
    const finalPhone = `20${phone}`

    const fullMessage = `السلام عليكم ولي أمر الطالب: *${student.name}* 
    
${values.message}

*رابط المتابعة:*
${link}`

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(fullMessage)}`
    window.open(url, '_blank')

    // ريست وقفل المودال
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 4. الزرار اللي هيظهر في الجدول (Trigger) */}
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700'
        >
          <MessageCircle className='h-4 w-4' />
        </Button>
      </DialogTrigger>

      {/* 5. محتوى المودال */}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageCircle className='h-5 w-5 text-green-500' />
            مراسلة ولي الأمر
          </DialogTitle>
          <DialogDescription className='text-right'>
            سيتم إرسال رابط متابعة الطالب <b>{student.name}</b> تلقائياً.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرسالة</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='اكتب ملاحظاتك هنا...'
                      className='resize-none'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button type='button' variant='ghost' onClick={() => setOpen(false)}>
                إلغاء
              </Button>
              <Button type='submit' className='bg-green-600 hover:bg-green-700 text-white'>
                إرسال واتساب <Send className='mr-2 h-4 w-4' />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
