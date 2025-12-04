'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { getDailyClasses } from '../../../../actions/Session/getDailyClasses'
import { formatTo12Hour } from '../../../../utils/formatTime'
import CancelButton from './CancelButton'
import StartButton from './StartButton'

type SessionCardData = Awaited<ReturnType<typeof getDailyClasses>>[number]

export default function SessionCard({
  session,
  currentDate,
  onUpdate,
}: {
  session: SessionCardData
  currentDate: string
  onUpdate: () => void
}) {
  const router = useRouter()
  const { groupName, startTime, endTime, studentCount, isCreated, status, sessionId } = session

  // 1. حالة الحصة لسه ماتفعلتش (شبح)
  if (!isCreated) {
    return (
      <Card className='border-dashed border-2 bg-muted/30 opacity-75 hover:opacity-100 transition-opacity'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg text-muted-foreground'>{groupName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-sm font-mono text-muted-foreground mb-2 text-right' dir='ltr'>
            {formatTo12Hour(startTime)} - {formatTo12Hour(endTime)}
          </div>
          <div className='text-xs text-muted-foreground'>عدد الطلاب: {studentCount}</div>
        </CardContent>
        <CardFooter className='flex gap-2'>
          {/* زرار الإلغاء */}
          <CancelButton currentDate={currentDate} session={session} onUpdate={onUpdate} />
          {/* زرار البدء */}
          <StartButton
            currentDate={currentDate}
            session={session}
            groupName={groupName}
            onUpdate={onUpdate}
          />
        </CardFooter>
      </Card>
    )
  }

  // 2. حالة الحصة حقيقية وموجودة (منورة)
  return (
    <Card
      className={cn(
        'border-l-4',
        status === 'COMPLETED'
          ? 'border-green-500'
          : status === 'CANCELED'
          ? 'border-destructive'
          : 'border-primary',
      )}
    >
      <CardHeader className='pb-2 flex flex-row justify-between items-start'>
        <CardTitle className='text-lg'>{groupName}</CardTitle>

        {/* بادج الحالة */}
        <span
          className={cn(
            'text-[10px] px-2 py-1 rounded-full font-bold',
            status === 'COMPLETED'
              ? 'bg-green-100 text-green-700'
              : status === 'CANCELED'
              ? 'bg-red-100 text-red-700'
              : 'bg-primary/10 text-primary',
          )}
        >
          {status === 'COMPLETED' ? 'تمت' : status === 'CANCELED' ? 'ملغية 🔕' : 'جارية'}
        </span>
      </CardHeader>

      <CardContent>
        <div className='text-2xl font-bold font-mono mb-1 text-right '>
          {formatTo12Hour(startTime)}
          <span className='text-sm text-muted-foreground font-sans'> حتى </span>
          {formatTo12Hour(endTime)}
        </div>
        <div className='text-sm text-muted-foreground'>عدد الطلاب: {studentCount}</div>
      </CardContent>

      <CardFooter>
        {/* إخفاء زرار الغياب لو الحصة ملغية */}
        {status !== 'CANCELED' && (
          <Button
            className='w-full'
            onClick={() => router.push(`/dashboard/sessions/${sessionId}`)}
          >
            تسجيل الغياب
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
