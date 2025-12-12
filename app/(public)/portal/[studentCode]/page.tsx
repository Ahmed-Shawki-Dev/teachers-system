import { getStudentPublicAction } from '@/actions/Student/getStudentPublic' // 👈 الأكشن الجديد
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  CheckCircle2,
  Phone,
  Wallet,
  XCircle,
  LucideIcon,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import StudentAttendanceTable from '../../../(dashboard)/dashboard/students/[studentId]/StudentAttendanceTable'
import StudentExamsTable from '../../../(dashboard)/dashboard/students/[studentId]/StudentExamsTable'
import StudentPaymentsTable from '../../../(dashboard)/dashboard/students/[studentId]/StudentPaymentsTable'

// 👇 استيراد الكومبوننتس العظيمة بتاعتك


interface PageProps {
  params: Promise<{
    studentCode: string
  }>
}

export default async function PortalStudentProfile({ params }: PageProps) {
  const { studentCode } = await params

  // 1. نستخدم الأكشن الـ Public
  const data = await getStudentPublicAction(studentCode)

  if (!data) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold text-destructive'>الكود غير صحيح</h1>
        <Link href='/portal'>
          <Button variant='outline'>العودة للبحث</Button>
        </Link>
      </div>
    )
  }

  const { info, stats, attendanceHistory, examsHistory, paymentsHistory } = data

  return (
    <div
      className='flex flex-col gap-6 p-4 container mx-auto max-w-5xl min-h-screen bg-muted/5'
      dir='rtl'
    >
      {/* زر العودة */}
      <Link
        href='/portal'
        className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit'
      >
        <ArrowRight className='w-4 h-4' />
        بحث آخر
      </Link>

      {/* 1. كارت البيانات (كودك مع تعديل بسيط) */}
      <Card className='border-t-4 border-t-primary shadow-md bg-background'>
        <CardHeader>
          <CardTitle className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <div>
              <h1 className='text-2xl font-bold'>{info.name}</h1>
              <p className='text-muted-foreground text-sm mt-1'>
                كود الطالب:{' '}
                <span className='font-mono text-primary font-bold'>{info.studentCode}</span>
              </p>
            </div>
            <div className='flex gap-2'>
              <Badge
                variant={info.groupName === 'بدون مجموعة' ? 'destructive' : 'default'}
                className='text-base px-4 py-1'
              >
                {info.groupName}
              </Badge>
              <Badge variant='secondary'>
                {info.paymentType === 'PER_SESSION' ? 'نظام الحصة' : 'نظام الشهر'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4'>
          {/* ... نفس كودك للعرض ... */}
          <div className='flex items-center gap-3 p-3 bg-muted/20 rounded-lg border'>
            <div className='bg-primary/10 p-2 rounded-full text-primary'>
              <Phone className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>رقم ولي الأمر</p>
              <p className='font-semibold text-lg dir-ltr text-right'>{info.phone}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-3 bg-muted/20 rounded-lg border'>
            <div className='bg-primary/10 p-2 rounded-full text-primary'>
              <Wallet className='w-5 h-5' />
            </div>
            <div>
              <p className='text-xs text-muted-foreground'>قيمة الاشتراك</p>
              <p className='font-bold text-lg'>
                {info.price} <span className='text-xs font-normal text-muted-foreground'>ج.م</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. الإحصائيات (كودك) */}
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

      {/* 3. الجداول (إعادة استخدام الكومبوننتس بتاعتك) 🚀 */}
      <div className='grid grid-cols-1 gap-8 pb-10'>
        <StudentAttendanceTable history={attendanceHistory ?? []} paymentType={info.paymentType} />{' '}
        <StudentExamsTable exams={examsHistory ?? []} />
        {info.paymentType !== 'PER_SESSION' && (
          <StudentPaymentsTable payments={paymentsHistory ?? []} />
        )}
      </div>
    </div>
  )
}

// Stats Card Component (نفس كودك)
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
    <Card className='border shadow-sm bg-background'>
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
