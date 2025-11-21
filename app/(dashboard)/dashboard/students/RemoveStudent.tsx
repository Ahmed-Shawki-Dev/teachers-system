'use client'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { removeStudentAction } from '../../../../actions/Student/removeStudent'

export default function RemoveStudent({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onClickHandler = async () => {
    try {
      setLoading(true)
      await removeStudentAction(studentId)
      setOpen(false)
      toast.success('الطالب اتمسح بنجاح')
    } catch (error) {
      toast.error('Failed')
      throw new Error('Error', error!)
    } finally {
      setLoading(false)
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>حذف</Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir='rtl'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription className='text-right'>
            هذه العملية لا يمكن التراجع عنها. سيتم حذف الطالب نهائيًا وإزالة بياناته من النظام.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>

          <Button variant={'destructive'} onClick={onClickHandler} disabled={loading}>
            {loading ? (
              <span className='animate-spin'>
                <Loader />
              </span>
            ) : (
              'تأكيد الحذف'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
