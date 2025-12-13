import { getAllGroupsAction } from '@/actions/Group/getGroups'
import StudentSearchInput from '@/components/StudentSearchInput'
import { GraduationCap } from 'lucide-react'
import { Suspense } from 'react'
import AddStudentModal from './AddStudentModal'
import StudentsFilter from './StudentsFilter'
import StudentsList from './StudentsList'
import StudentsSkeleton from './StudentsSkeleton'

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; groupId?: string; page?: string }>
}) {
  const params = await searchParams
  const query = params.query || ''
  const groupId = params.groupId || ''
  const page = Number(params.page) || 1

  // 1. بنجيب المجموعات للفلتر (سريعة ومش هتأثر قوي)
  const groups = await getAllGroupsAction()

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      {/* الهيدر الثابت */}
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <GraduationCap className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الطلاب</h1>
            <p className='text-sm text-muted-foreground'>إدارة جميع الطلاب المسجلين</p>
          </div>
        </div>

        <div className='w-full sm:w-auto'>
          <AddStudentModal />
        </div>
      </div>

      {/* منطقة الفلتر والبحث (بتظهر علطول) */}
      <div className='flex flex-col sm:flex-row gap-4 bg-muted/20 p-4 rounded-lg border border-dashed items-center'>
        <div className='flex-1 w-full'>
          <StudentSearchInput />
        </div>
        <div className='w-full sm:w-auto'>
          <StudentsFilter groups={groups} />
        </div>
      </div>

      {/* منطقة الطلاب (Streaming) */}
      {/* الـ key بيضمن ان الـ Skeleton يظهر لما تغير الفلتر او الصفحة */}
      <Suspense key={query + groupId + page} fallback={<StudentsSkeleton />}>
        <StudentsList page={page} query={query} groupId={groupId} />
      </Suspense>
    </div>
  )
}
