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
import { FileBarChart2 } from 'lucide-react'

type ExamRecord = {
  id: string
  title: string
  date: Date
  score: number
  maxScore: number
}

export default function StudentExamsTable({ exams }: { exams: ExamRecord[] }) {
  return (
    <Card className='bg-transparent'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileBarChart2 className='w-5 h-5 text-primary' />
          سجل الامتحانات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exams.length > 0 ? (
          <div className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted/50 hover:bg-muted/50'>
                  <TableHead>الامتحان</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الدرجة</TableHead>
                  <TableHead>التقدير</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => {
                  const percentage = Math.round((exam.score / exam.maxScore) * 100)
                  let gradeColor = 'bg-green-100 text-green-700'
                  if (percentage < 50) gradeColor = 'bg-red-100 text-red-700'
                  else if (percentage < 80) gradeColor = 'bg-yellow-100 text-yellow-700'

                  return (
                    <TableRow key={exam.id} className='hover:bg-muted/5 transition-colors'>
                      <TableCell className='font-bold'>{exam.title}</TableCell>
                      <TableCell>{new Date(exam.date).toLocaleDateString('en-EG')}</TableCell>
                      <TableCell>
                        <span className='font-bold'>{exam.score}</span>
                        <span className='text-muted-foreground text-xs'> / {exam.maxScore}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary' className={gradeColor}>
                          {percentage}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed'>
            <p>لم يخضع لأي امتحانات بعد</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
