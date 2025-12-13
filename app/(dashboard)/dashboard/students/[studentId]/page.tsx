import { Suspense } from 'react'
import StudentProfileContent from './StudentProfileContent'
import StudentProfileSkeleton from './StudentProfileSkeleton'

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params

  return (
    <Suspense fallback={<StudentProfileSkeleton />}>
      <StudentProfileContent studentId={studentId} />
    </Suspense>
  )
}
