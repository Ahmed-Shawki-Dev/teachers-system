import { getAllGroupsAction } from '@/actions/Group/getGroups'
import { Newspaper } from 'lucide-react'
import { Suspense } from 'react'
import AddExamModal from './AddExam'
import ExamsFilter from './ExamsFilter'
import ExamsList from './ExamsList'
import ExamsSkeleton from './ExamsSkeleton'

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ groupId?: string }>
}) {
  const params = await searchParams
  const groupId = params.groupId || ''

  // 1. المجموعات بتيجي بسرعة ومحتاجينها فوق في الهيدر والمودال
  const groups = await getAllGroupsAction()

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      {/* الهيدر الثابت */}
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
          <ExamsFilter groups={groups} />
          <AddExamModal groups={groups} />
        </div>
      </div>

      {/* منطقة الكروت (Streaming) */}
      <Suspense key={groupId} fallback={<ExamsSkeleton />}>
        <ExamsList groupId={groupId} />
      </Suspense>
    </div>
  )
}
