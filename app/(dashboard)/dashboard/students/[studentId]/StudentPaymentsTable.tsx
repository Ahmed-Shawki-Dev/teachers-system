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
    <Card >
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Banknote className='w-5 h-5 text-green-600' />
          سجل المدفوعات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>تفاصيل</TableHead>
                  <TableHead>النوع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className='hover:bg-muted/5 transition-colors'>
                    <TableCell>{new Date(p.date).toLocaleDateString('en-EG')}</TableCell>
                    <TableCell className='font-bold text-green-700'>{p.amount} ج.م</TableCell>
                    <TableCell className='text-muted-foreground'>{p.details}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='text-xs'>
                        {p.type === 'PER_SESSION' ? 'حصة' : 'شهر'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
