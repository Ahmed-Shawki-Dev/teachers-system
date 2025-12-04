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

const StartButton = ({
  session,
  currentDate,
  groupName,
  onUpdate,
}: {
  session: SessionCardData
  currentDate: string
  groupName: string
  onUpdate: () => void
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='default' className='flex-1'>
          بدء الحصة
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-right'>بدء الحصة</AlertDialogTitle>
          <AlertDialogDescription className='text-right'>
            هل أنت جاهز لبدء حصة <b>{groupName}</b>؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-row-reverse sm:justify-start gap-2'>
          <AlertDialogCancel>تراجع</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              // بنبعت 'SCHEDULED' هنا (أو نسيبها فاضية لأنها الديفولت)
              const res = await createSessionAction(session.groupId, currentDate, 'SCHEDULED')
              if (res.success) {
                toast.success(res.message)
                onUpdate()
              } else toast.error(res.message)
            }}
          >
            ابدأ الحصة
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default StartButton
