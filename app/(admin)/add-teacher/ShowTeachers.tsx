import { Users } from 'lucide-react'
import { getAllTeachersAction } from '../../../actions/Teacher/getTeachers'
import TeacherCard from './TeacherCard'

const ShowTeachers = async () => {
  const teachers = await getAllTeachersAction()

  if (!teachers || teachers.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20'>
        <div className='bg-muted p-4 rounded-full mb-4'>
          <Users className='h-10 w-10 text-muted-foreground' />
        </div>
        <h3 className='font-bold text-lg'>لا يوجد مدرسين</h3>
        <p className='text-muted-foreground'>ابدأ بإضافة أول مدرس من النموذج الجانبي.</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      {teachers.map((teacher) => (
        <TeacherCard
          key={teacher.id}
          id={teacher.id}
          name={teacher.name}
          avatarUrl={teacher.avatarUrl!}
          // افترضت إن الـ Action بيرجع الداتا دي، لو لأ ممكن تشيلهم
          email={teacher.email}
          phone={teacher.phone!}
          bio={''}
        />
      ))}
    </div>
  )
}

export default ShowTeachers
