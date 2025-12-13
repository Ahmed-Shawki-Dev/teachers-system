import { getDailyClasses } from '@/actions/Session/getDailyClasses'
import SessionCard from './SessionCard'

export default async function SessionsList({ date }: { date: string }) {
  // تصحيح 1: شيلنا new Date() لأن الأكشن مستني string أصلاً
  const sessions = await getDailyClasses(date)

  if (!sessions || sessions.length === 0) {
    return (
      <div className='text-center p-10 text-muted-foreground border rounded-lg border-dashed'>
        مفيش حصص في التاريخ ده
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {sessions.map((session) => (
        // تصحيح 2: عملنا مفتاح مميز من دمج جروب ووقت لأن مفيش id ثابت
        // تصحيح 3: بعتنا currentDate وشيلنا onUpdate
        <SessionCard
          key={`${session.groupId}-${session.startTime}`}
          session={session}
          currentDate={date}
        />
      ))}
    </div>
  )
}
