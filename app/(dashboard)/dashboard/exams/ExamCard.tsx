import { ExamWithData } from '@/actions/Exam/getExams'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Calendar, FileBarChart, Users } from 'lucide-react'
import Link from 'next/link'
import RemoveExam from './RemoveExams'
// 👇 استيراد الدالة
import { getFullGroupName } from '@/utils/groupName'

export default function ExamCard({ exam }: { exam: ExamWithData }) {
  const {group} = exam;
  const {grade,name} = group
  return (
    <Card className='relative hover:border-primary/50 hover:shadow-md transition-all group h-full'>
      <div className='absolute top-1 left-1 z-20'>
        <RemoveExam examId={exam.id} />
      </div>

      <Link href={`/dashboard/exams/${exam.id}`} className='block h-full'>
        <CardHeader className='flex flex-row items-start justify-between pb-2 pl-10'>
          <div className='space-y-1'>
            <CardTitle className='text-lg group-hover:text-primary transition-colors'>
              {exam.title}
            </CardTitle>
            {/* 👇 التعديل هنا */}
            <Badge variant='outline' className='font-normal text-muted-foreground'>
              {getFullGroupName({grade,name})}
            </Badge>
          </div>
          <div className='bg-primary/10 p-2 rounded-lg text-primary'>
            <FileBarChart className='w-5 h-5' />
          </div>
        </CardHeader>

        <CardContent className='space-y-4 pt-2'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Calendar className='w-4 h-4' />
              <span>{format(new Date(exam.date), 'd MMMM yyyy', { locale: ar })}</span>
            </div>
            <div className='flex items-center gap-1 font-medium'>
              <span className='text-base text-foreground'>{exam.maxScore}</span>
              <span className='text-xs text-muted-foreground'>درجة</span>
            </div>
          </div>

          <div className='flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t'>
            <Users className='w-4 h-4' />
            <span>
              تم الرصد لـ <span className='text-foreground font-bold'>{exam._count.results}</span>{' '}
              طالب
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
