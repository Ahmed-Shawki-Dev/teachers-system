import { getAllGroupsAction } from '@/actions/Group/getGroups'
import { ExamWithData, getExamsAction } from '../../../../actions/Exam/getExams'
import AddExamModal from './AddExam'
import ExamCard from './ExamCard'
import ExamsFilter from './ExamsFilter'
import { Newspaper } from 'lucide-react'

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ groupId?: string }>
}) {
  const params = await searchParams
  const groupId = params.groupId || ''

  // 1. هات الداتا (بالتوازي عشان السرعة)
  const [exams, groups] = await Promise.all([getExamsAction(groupId), getAllGroupsAction()])

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      {/* الهيدر والتحكم */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Newspaper className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الامتحانات</h1>
            <p className='text-sm text-muted-foreground'>إدارة الامتحانات ورصد الدرجات</p>
          </div>
        </div>

        <div className='flex gap-2 w-full sm:w-auto'>
          {/* فلتر المجموعات */}
          <ExamsFilter groups={groups} />
          {/* زرار الإضافة (لازم نبعتله المجموعات عشان الـ Select) */}
          <AddExamModal groups={groups} />
        </div>
      </div>

      {/* عرض الكروت */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {exams.length > 0 ? (
          exams.map((exam: ExamWithData) => <ExamCard key={exam.id} exam={exam} />)
        ) : (
          <div className='col-span-full py-12 text-center bg-muted/20 rounded-lg border border-dashed text-muted-foreground'>
            لا توجد امتحانات في هذه المجموعة حالياً
          </div>
        )}
      </div>
    </div>
  )
}
