import { Suspense } from 'react'
import ExamDetailsContent from './ExamDetailsContent'
import ExamDetailsSkeleton from './ExamDetailsSkeleton'

export default async function ExamDetailsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params

  return (
    <div className='container mx-auto py-6 max-w-4xl'>
      <Suspense fallback={<ExamDetailsSkeleton />}>
        <ExamDetailsContent examId={examId} />
      </Suspense>
    </div>
  )
}
