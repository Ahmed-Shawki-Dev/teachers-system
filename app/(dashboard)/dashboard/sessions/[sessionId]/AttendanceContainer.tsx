import { getSessionAttendance } from '@/actions/Session/getSessionAttendance'
import AttendanceSheet from './AttendanceSheet'

export default async function AttendanceContainer({ sessionId }: { sessionId: string }) {
  // الـ Await التقيلة هنا
  const data = await getSessionAttendance(sessionId)

  return (
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
  )
}
