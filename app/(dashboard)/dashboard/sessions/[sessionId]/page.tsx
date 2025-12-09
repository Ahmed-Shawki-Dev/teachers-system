import { getSessionAttendance } from '@/actions/Session/getSessionAttendance'
import AttendanceSheet from './AttendanceSheet'

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await params

  // بنجيب الداتا من الأكشن اللي عملناه المرة اللي فاتت
  const data = await getSessionAttendance(sessionId)

  return (
    <div className='container mx-auto py-6 max-w-4xl'>
      <AttendanceSheet
        sessionId={sessionId}
        initialData={data.students}
        sessionInfo={{
          groupName: data.groupName,
          date: data.sessionDate,
          price: data.price,
          paymentType: data.paymentType,
        }}
      />
    </div>
  )
}
