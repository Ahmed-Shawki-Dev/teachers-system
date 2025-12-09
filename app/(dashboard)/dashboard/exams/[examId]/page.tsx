import { getExamDetails } from '@/actions/Exam/getExamDetails'
import ExamSheet from './ExamSheet'

export default async function ExamDetailsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params

  // هات الداتا من الأكشن
  const data = await getExamDetails(examId)

  return (
    <div className='container mx-auto py-6 max-w-4xl'>
      <ExamSheet
        examId={examId}
        initialData={data.students}
        examInfo={{
          title: data.examTitle,
          maxScore: data.maxScore,
          groupName: data.groupName,
          date: data.date,
        }}
      />
    </div>
  )
}
