import { getStudentHistory } from '@/actions/Student/getStudentHistory'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle2, LucideIcon, Phone, Users, XCircle } from 'lucide-react'
import StudentAttendanceTable from './StudentAttendanceTable'
import StudentExamsTable from './StudentExamsTable'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  // دلوقتي بنستلم examsHistory كمان
  const { info, stats, attendanceHistory, examsHistory } = await getStudentHistory(studentId)

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto max-w-5xl'>
      {/* 1. كارت البيانات (زي ما هو) */}
      <Card className='border-t-4 border-t-primary shadow-md'>
        <CardHeader>
          <CardTitle className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
              <h1 className='text-2xl font-bold'>{info.name}</h1>
              <p className='text-muted-foreground text-sm mt-1'>
                كود الطالب: <span className='font-mono'>{info.id.slice(-6)}</span>
              </p>
            </div>
            <Badge
              variant={info.groupName === 'بدون مجموعة' ? 'destructive' : 'default'}
              className='text-base px-4 py-1'
            >
              {info.groupName}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
          <div className='flex items-center gap-3 p-3 bg-muted/20 rounded-lg border'>
            <div className='bg-primary/10 p-2 rounded-full text-primary'>
              <Phone className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>رقم ولي الأمر</p>
              <p className='font-mono font-semibold text-lg dir-ltr text-right'>{info.phone}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-3 bg-muted/20 rounded-lg border'>
            <div className='bg-primary/10 p-2 rounded-full text-primary'>
              <Users className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>سعر الحصة</p>
              <p className='font-bold text-lg'>
                {info.price} <span className='text-xs font-normal text-muted-foreground'>ج.م</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. الإحصائيات (زي ما هي) */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatsCard label='إجمالي الحصص' value={stats.total} icon={Calendar} />
        <StatsCard
          label='حضور'
          value={stats.present}
          icon={CheckCircle2}
          color='text-green-600 bg-green-50'
        />
        <StatsCard
          label='غياب'
          value={stats.absent}
          icon={XCircle}
          color='text-red-600 bg-red-50'
        />
      </div>

      {/* 3. الجداول (المفصولة) */}
      <div className='grid grid-cols-1 gap-6'>
        {/* جدول الامتحانات أولاً (عشان مهم) */}
        <StudentExamsTable exams={examsHistory} />

        {/* جدول الغياب */}
        <StudentAttendanceTable history={attendanceHistory} />
      </div>
    </div>
  )
}

// --- StatsCard ---
interface StatsCardProps {
  label: string
  value: number
  icon: LucideIcon
  color?: string
}

function StatsCard({
  label,
  value,
  icon: Icon,
  color = 'text-primary bg-primary/10',
}: StatsCardProps) {
  return (
    <Card className='border shadow-sm'>
      <CardContent className='flex flex-col items-center justify-center p-6 gap-2'>
        <div className={`p-3 rounded-full ${color} mb-1`}>
          <Icon className='w-6 h-6' />
        </div>
        <div className='text-3xl font-bold'>{value}</div>
        <div className='text-xs font-medium text-muted-foreground'>{label}</div>
      </CardContent>
    </Card>
  )
}
