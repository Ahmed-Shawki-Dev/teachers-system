// components/Student/StudentAttendanceTable.tsx
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CalendarCheck2, Check, X } from 'lucide-react'

type AttendanceRecord = {
  id: string
  date: Date
  status: string
  note: string | null
  hasPaid: boolean
  paymentAmount: number
}

// 1. ضفنا paymentType هنا 👇
export default function StudentAttendanceTable({
  history,
  paymentType,
}: {
  history: AttendanceRecord[]
  paymentType: string
}) {
  // متغير عشان نعرف هل هو بيحاسب بالحصة ولا لأ
  const isPerSession = paymentType === 'PER_SESSION'

  return (
    <Card className='bg-transparent'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CalendarCheck2 className='w-5 h-5 text-primary' />
          سجل الحضور والغياب
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className='text-center'>الحالة</TableHead>

                  {/* 2. إخفاء عنوان العمود لو مش بالحصة 👇 */}
                  {isPerSession && <TableHead className='text-center'>الدفع</TableHead>}

                  <TableHead>ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id} className='hover:bg-muted/5 transition-colors'>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className='text-center'>
                      {record.status === 'PRESENT' ? (
                        <Badge className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'>
                          حاضر
                        </Badge>
                      ) : (
                        <Badge className='bg-red-100 text-red-700 hover:bg-red-200 border-red-200'>
                          غائب
                        </Badge>
                      )}
                    </TableCell>

                    {/* 3. إخفاء الخانة نفسها لو مش بالحصة 👇 */}
                    {isPerSession && (
                      <TableCell className='text-center'>
                        {record.hasPaid ? (
                          <div className='flex items-center justify-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full border border-green-100 w-fit mx-auto'>
                            <Check className='w-3 h-3' />
                            <span>دفع</span>
                          </div>
                        ) : record.status === 'PRESENT' ? (
                          <div className='flex items-center justify-center gap-1 text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit mx-auto'>
                            <X className='w-3 h-3' />
                            <span>لم يدفع</span>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                    )}

                    <TableCell className='text-muted-foreground max-w-[150px] truncate'>
                      {record.note || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
