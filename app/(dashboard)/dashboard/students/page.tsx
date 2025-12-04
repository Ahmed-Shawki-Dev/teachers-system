import AddStudentModal from './AddStudentModal'
import ShowStudents from './ShowStudents'
import StudentSearchInput from '../../../../components/StudentSearchInput'
import StudentsFilter from './StudentsFilter'

const StudentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; groupId?: string; grade?: string }>
}) => {
  // 1. فك الـ Promise وهات الداتا من الـ URL
  const params = await searchParams
  const grade = params.grade || ''
  const query = params.query || ''
  const groupId = params.groupId || ''

  return (
    <div className='flex flex-col items-center gap-10'>
      <div className='w-full flex justify-between items-center px-4'>
        <h1 className='text-2xl font-bold'>الطلاب</h1>
        <AddStudentModal />
      </div>

      <div className='flex gap-4 flex-wrap justify-center bg-muted/20 p-4 rounded-lg'>
        <StudentSearchInput />
        <StudentsFilter />
      </div>

      {/* 2. باصي الداتا للكومبوننت عشان يعرف يفلتر */}
      <ShowStudents search={query} groupId={groupId} grade={grade} />
    </div>
  )
}

export default StudentsPage
