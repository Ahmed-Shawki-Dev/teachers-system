import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, CalendarClock } from 'lucide-react'

type PaymentRecord = {
  id: string
  amount: number
  date: Date
  type: string
  details: string | null
}

export default function StudentPaymentsTable({ payments }: { payments: PaymentRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Banknote className='w-5 h-5 text-green-600' />
          سجل المدفوعات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className='border rounded-lg overflow-hidden'>
            <table className='w-full text-right text-sm'>
              <thead className='bg-muted text-muted-foreground'>
                <tr>
                  <th className='p-4 font-medium'>التاريخ</th>
                  <th className='p-4 font-medium'>المبلغ</th>
                  <th className='p-4 font-medium'>تفاصيل</th>
                  <th className='p-4 font-medium'>النوع</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className='border-b last:border-0 hover:bg-muted/5'>
                    <td className='p-4 font-mono'>
                      {new Date(p.date).toLocaleDateString('ar-EG')}
                    </td>
                    <td className='p-4 font-bold text-green-700'>{p.amount} ج.م</td>
                    <td className='p-4 text-muted-foreground'>{p.details}</td>
                    <td className='p-4'>
                      <Badge variant='outline' className='text-xs'>
                        {p.type === 'PER_SESSION' ? 'حصة' : 'شهر'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed'>
            <CalendarClock className='w-8 h-8 mb-2 opacity-20' />
            <p>لا يوجد سجل مدفوعات</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
