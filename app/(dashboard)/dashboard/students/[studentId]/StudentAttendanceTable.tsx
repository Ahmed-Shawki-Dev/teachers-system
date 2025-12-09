import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck2 } from 'lucide-react'

type AttendanceRecord = {
  id: string
  date: Date
  status: string // "PRESENT" | "ABSENT"
  note: string | null
}

export default function StudentAttendanceTable({ history }: { history: AttendanceRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarCheck2 className='w-5 h-5 text-primary' />
          سجل الحضور والغياب
        </CardTitle>
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
                  <tr key={record.id} className='border-b last:border-0 hover:bg-muted/5'>
                    <td className='p-4 font-mono'>
                      {new Date(record.date).toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className='p-4'>
                      {record.status === 'PRESENT' ? (
                        <Badge className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'>
                          حاضر
                        </Badge>
                      ) : (
                        <Badge className='bg-red-100 text-red-700 hover:bg-red-200 border-red-200'>
                          غائب
                        </Badge>
                      )}
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
          <div className='flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed'>
            <p>لا يوجد سجل حضور حتى الآن</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
