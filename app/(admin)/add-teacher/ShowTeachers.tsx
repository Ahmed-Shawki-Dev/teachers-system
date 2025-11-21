import { getAllTeachersAction } from '../../../actions/Teacher/getTeachers'
import TeacherCard from './TeacherCard'

const ShowTeachers = async () => {
  const teachers = await getAllTeachersAction()
  return (
    <div className='flex gap-2'>
      {teachers.map((teacher) => (
        <TeacherCard
          id={teacher.id}
          name={teacher.name}
          avatarUrl={teacher.avatarUrl!}
          key={teacher.id}
        />
      ))}
    </div>
  )
}

export default ShowTeachers
