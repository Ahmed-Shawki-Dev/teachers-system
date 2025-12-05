import { getStudentHistory } from '@/actions/Student/getStudentHistory'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CheckCircle2, Phone, Users, XCircle, type LucideIcon } from 'lucide-react'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const { info, stats, history } = await getStudentHistory(studentId)

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto max-w-5xl'>
      {/* 1. كارت البيانات الأساسية */}
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

      {/* 2. كروت الإحصائيات (بقوا 3 بس) */}
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

      {/* 3. جدول الحضور التفصيلي */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>سجل الحضور والغياب</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className='border rounded-lg overflow-hidden'>
              <table className='w-full text-right text-sm'>
                <thead className='bg-muted text-muted-foreground'>
                  <tr>
                    <th className='p-4 font-medium'>التاريخ</th>
                    <th className='p-4 font-medium'>الحالة</th>
                    <th className='p-4 font-medium'>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr
                      key={record.id}
                      className='border-b last:border-0 hover:bg-muted/5 transition-colors'
                    >
                      <td className='p-4 font-mono'>
                        {new Date(record.date).toLocaleDateString('ar-EG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className='p-4'>
                        <StatusBadge status={record.status} />
                      </td>
                      <td className='p-4 text-muted-foreground max-w-[200px] truncate'>
                        {record.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/10 rounded-lg border border-dashed'>
              <Calendar className='w-10 h-10 mb-2 opacity-20' />
              <p>لا يوجد سجل حضور لهذا الطالب حتى الآن</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- مكونات مساعدة ---

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PRESENT: 'bg-green-100 text-green-700 border-green-200',
    ABSENT: 'bg-red-100 text-red-700 border-red-200',
  }

  const labels: Record<string, string> = {
    PRESENT: 'حاضر',
    ABSENT: 'غائب',
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || ''}`}>
      {labels[status] || status}
    </span>
  )
}
