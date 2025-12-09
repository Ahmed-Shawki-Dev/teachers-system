import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck2, Check, X } from 'lucide-react'

type AttendanceRecord = {
  id: string
  date: Date
  status: string
  note: string | null
  hasPaid: boolean // 👈 الحالة الجديدة
  paymentAmount: number
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
              <thead className='bg-muted/50 text-muted-foreground'>
                <tr>
                  <th className='p-4 font-medium'>التاريخ</th>
                  <th className='p-4 font-medium text-center'>الحالة</th>
                  <th className='p-4 font-medium text-center'>الدفع</th> {/* عمود جديد */}
                  <th className='p-4 font-medium'>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className='border-b last:border-0 hover:bg-muted/5'>
                    <td className='p-4 font-mono'>
                      {new Date(record.date).toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className='p-4 text-center'>
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

                    {/* حالة الدفع */}
                    <td className='p-4 text-center'>
                      {record.hasPaid ? (
                        <div className='flex items-center justify-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-100 w-fit mx-auto'>
                          <Check className='w-3 h-3' />
                          <span>دفع</span>
                        </div>
                      ) : record.status === 'PRESENT' ? (
                        // حضر بس مدفعش (عليه فلوس)
                        <div className='flex items-center justify-center gap-1 text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit mx-auto'>
                          <X className='w-3 h-3' />
                          <span>لم يدفع</span>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>-</span>
                      )}
                    </td>

                    <td className='p-4 text-muted-foreground max-w-[150px] truncate'>
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
