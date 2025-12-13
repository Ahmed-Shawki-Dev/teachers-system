import { getExamsAction } from '@/actions/Exam/getExams'
import ExamCard from './ExamCard'

export default async function ExamsList({ groupId }: { groupId: string }) {
  // الـ Fetching هنا
  const exams = await getExamsAction(groupId)

  if (!exams || exams.length === 0) {
    return (
      <div className='col-span-full py-12 text-center bg-muted/20 rounded-lg border border-dashed text-muted-foreground'>
        لا توجد امتحانات في هذه المجموعة حالياً
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  )
}
