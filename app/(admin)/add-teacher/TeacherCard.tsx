'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ITeacherDB } from '../../../interfaces/teachers'
import { removeTeacherAction } from '../../../actions/Teacher/removeTeacher'
import { Trash2, Phone, Mail, User, ShieldCheck, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Badge } from '@/components/ui/badge'

// ضفت الـ Props دي عشان يبقى الكارت غني بالمعلومات


const TeacherCard = ({ name, id, avatarUrl, email, phone }: Partial<ITeacherDB>) => {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    // تأكيد بسيط (ممكن تعمله بـ Dialog لو عايز، بس ده أسرع)
    if (!confirm('هل أنت متأكد من حذف هذا المدرس؟ لا يمكن التراجع.')) return

    startTransition(async () => {
      try {
        await removeTeacherAction(id!)
        toast.success('تم حذف المدرس بنجاح')
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف')
      }
    })
  }

  return (
    <Card className='group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border-muted/60'>
      {/* Decorative Gradient Background */}
      <div className='absolute top-0 left-0 w-full h-20 bg-linear-to-r from-primary/10 to-primary/5 -z-10' />

      <CardContent className='pt-8 pb-4 flex flex-col items-center text-center gap-3'>
        {/* Avatar Image with Ring */}
        <div className='relative'>
          <div className='h-24 w-24 rounded-full border-4 border-background shadow-md overflow-hidden relative'>
            <Image
              src={avatarUrl || '/avatar.webp'}
              alt={name || 'Teacher'}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
          {/* Status Indicator */}
          <div
            className='absolute bottom-1 right-1 h-5 w-5 bg-green-500 border-2 border-white rounded-full'
            title='Active'
          />
        </div>

        {/* Name & Badge */}
        <div className='space-y-1'>
          <h3 className='font-bold text-lg leading-none'>{name}</h3>
          <Badge variant='secondary' className='text-xs font-normal opacity-80'>
            <ShieldCheck className='w-3 h-3 mr-1 inline' /> مدرس
          </Badge>
        </div>

        {/* Info List */}
        <div className='w-full space-y-2 mt-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg'>
          {email && (
            <div className='flex items-center gap-2 justify-center overflow-hidden text-ellipsis'>
              <Mail size={14} className='shrink-0' />
              <span className='truncate max-w-[180px]'>{email}</span>
            </div>
          )}
          {phone && (
            <div className='flex items-center gap-2 justify-center'>
              <Phone size={14} className='shrink-0' />
              <span className='font-mono tracking-wide'>{phone}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className='bg-muted/10 py-3 flex justify-between items-center gap-2 border-t'>
        <Button variant='ghost' size='sm' className='flex-1 text-xs'>
          <User size={14} className='mr-2' />
          الملف الشخصي
        </Button>
        <div className='h-4 w-px bg-border' />
        <Button
          variant='ghost'
          size='icon'
          className='text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20'
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? <Loader2 className='animate-spin' size={18} /> : <Trash2 size={18} />}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TeacherCard
