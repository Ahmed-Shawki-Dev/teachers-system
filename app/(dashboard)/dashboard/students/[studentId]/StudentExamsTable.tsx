import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileBarChart2 className='w-5 h-5 text-primary' />
          سجل الامتحانات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exams.length > 0 ? (
          <div className='border rounded-lg overflow-hidden'>
            <table className='w-full text-right text-sm'>
              <thead className='bg-muted text-muted-foreground'>
                <tr>
                  <th className='p-4 font-medium'>الامتحان</th>
                  <th className='p-4 font-medium'>التاريخ</th>
                  <th className='p-4 font-medium'>الدرجة</th>
                  <th className='p-4 font-medium'>التقدير</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const percentage = Math.round((exam.score / exam.maxScore) * 100)
                  let gradeColor = 'bg-green-100 text-green-700'
                  if (percentage < 50) gradeColor = 'bg-red-100 text-red-700'
                  else if (percentage < 80) gradeColor = 'bg-yellow-100 text-yellow-700'

                  return (
                    <tr key={exam.id} className='border-b last:border-0 hover:bg-muted/5'>
                      <td className='p-4 font-bold'>{exam.title}</td>
                      <td className='p-4 font-mono'>
                        {new Date(exam.date).toLocaleDateString('en-EG')}
                      </td>
                      <td className='p-4'>
                        <span className='font-bold'>{exam.score}</span>
                        <span className='text-muted-foreground text-xs'> / {exam.maxScore}</span>
                      </td>
                      <td className='p-4'>
                        <Badge variant='secondary' className={gradeColor}>
                          {percentage}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
