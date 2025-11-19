import AddTeacherForm from './addTeacherForm'
import ShowTeachers from './ShowTeachers'

export default function Page() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-10'>
      <AddTeacherForm />
      <ShowTeachers />
      
    </div>
  )
}
