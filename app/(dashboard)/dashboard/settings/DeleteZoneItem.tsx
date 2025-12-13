'use client'

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
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeleteZoneItemProps {
  title: string
  description: string
  buttonText: string
  action: () => Promise<{ success: boolean; message: string }>
}

export default function DeleteZoneItem({
  title,
  description,
  buttonText,
  action,
}: DeleteZoneItemProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await action()
      if (res.success) {
        toast.success(res.message)
        setOpen(false)
      } else {
        toast.error(res.message)
      }
    } catch {
      toast.error('حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30 gap-4'>
      <div>
        <h3 className='font-bold text-red-900 dark:text-red-500 flex items-center gap-2'>
          {title}
        </h3>
        <p className='text-sm text-red-700/80 dark:text-red-400'>{description}</p>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant='destructive' className='w-full sm:w-auto shrink-0'>
            <Trash2 className='w-4 h-4 ml-2' />
            {buttonText}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-right'>هل أنت متأكد تماماً؟</AlertDialogTitle>
            <AlertDialogDescription className='text-right'>
              هذا الإجراء <b>نهائي ولا يمكن التراجع عنه</b>. سيؤدي إلى حذف البيانات المحددة نهائياً
              من قاعدة البيانات.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-row-reverse sm:justify-start gap-2'>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleConfirm()
              }}
              className='bg-red-600 hover:bg-red-700'
              disabled={loading}
            >
              {loading ? <Loader2 className='animate-spin w-4 h-4' /> : 'نعم، احذف نهائياً'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
