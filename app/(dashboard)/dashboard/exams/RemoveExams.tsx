'use client'

import { removeExamAction } from '@/actions/Exam/removeExam'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function RemoveExam({ examId }: { examId: string }) {
  const [loading, setLoading] = useState(false)

  const handleRemove = async (e: React.MouseEvent) => {
    // لمنع فتح الكارت لما ندوس على زرار الحذف
    e.preventDefault()

    setLoading(true)
    try {
      const res = await removeExamAction(examId)
      if (res.success) toast.success(res.message)
      else toast.error(res.message)
    } catch (error) {
      toast.error('حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='link'
          size='icon'
          className='h-6 w-6 text-muted-foreground hover:text-red-600  absolute top-1 left-1 z-10'
          onClick={(e) => e.stopPropagation()}
        >
          <X className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>حذف الامتحان؟</AlertDialogTitle>
          <AlertDialogDescription className='text-right'>
            هذا الإجراء نهائي. سيتم حذف الامتحان و<b>جميع درجات الطلاب</b> المرتبطة به.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className='bg-red-600 hover:bg-red-700 focus:ring-red-600'
          >
            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : 'نعم، احذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
