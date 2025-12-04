import { toast } from 'sonner'
import { createSessionAction } from '../../../../actions/Session/createSession'
import { SessionCardData } from '../../../../actions/Session/getDailyClasses'
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
} from '../../../../components/ui/alert-dialog'
import { Button } from '../../../../components/ui/button'

const CancelButton = ({
  session,
  currentDate,
  onUpdate,
}: {
  session: SessionCardData
  currentDate: string
  onUpdate: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary' className='flex-1'>
          إلغاء
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>إلغاء الحصة؟</AlertDialogTitle>
          <AlertDialogDescription className='text-right'>
            سيتم تسجيل الحصة كـ ملغية. (ميزة الرسائل قادمة قريباً 😉)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-row-reverse sm:justify-start gap-2'>
          <AlertDialogCancel>تراجع</AlertDialogCancel>
          <AlertDialogAction
            className='bg-destructive hover:bg-destructive/90'
            onClick={async () => {
              // بنبعت 'CANCELED' هنا
              const res = await createSessionAction(session.groupId, currentDate, 'CANCELED')
              if (res.success) {
                toast.success(res.message)
                onUpdate()
              } else toast.error(res.message)
            }}
          >
            تأكيد الإلغاء
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CancelButton
