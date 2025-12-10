import { getAllGroupsAction } from '@/actions/Group/getGroups'
import AddStudentModal from './AddStudentModal'
import ShowStudents from './ShowStudents'
import StudentSearchInput from '@/components/StudentSearchInput'
import StudentsFilter from './StudentsFilter'
import { GraduationCap } from 'lucide-react'

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; groupId?: string }>
}) {
  const params = await searchParams
  const query = params.query || ''
  const groupId = params.groupId || ''

  const groups = await getAllGroupsAction()

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <GraduationCap className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الطلاب</h1>
            <p className='text-sm text-muted-foreground'>قاعدة بيانات الطلاب والسجلات الأكاديمية</p>
          </div>
        </div>

        <div className='w-full sm:w-auto'>
          <AddStudentModal />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 bg-muted/20 p-4 rounded-lg border border-dashed items-center'>
        <div className='flex-1 w-full'>
          <StudentSearchInput />
        </div>
        <div className='w-full sm:w-auto'>
          <StudentsFilter groups={groups} />
        </div>
      </div>

      <ShowStudents search={query} groupId={groupId} />
    </div>
  )
}
