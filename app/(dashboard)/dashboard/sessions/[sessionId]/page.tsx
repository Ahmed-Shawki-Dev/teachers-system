import { Suspense } from 'react'
import AttendanceContainer from './AttendanceContainer'
import AttendanceSkeleton from './AttendanceSkeleton'

type PageProps = {
  params: Promise<{ sessionId: string }>
}

export default async function SessionDetailsPage({ params }: PageProps) {
  const { sessionId } = await params

  return (
    <div className='container mx-auto py-6 max-w-4xl'>
      {/* هنا السحر كله: الصفحة بتفتح والـ Skeleton شغال لحد ما الـ Container يخلص */}
      <Suspense fallback={<AttendanceSkeleton />}>
        <AttendanceContainer sessionId={sessionId} />
      </Suspense>
    </div>
  )
}
