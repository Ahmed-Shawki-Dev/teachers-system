import AddStudentModal from './AddStudentModal'
import ShowStudents from './ShowStudents'

const page = () => {
  return (
    <div className='flex flex-col items-center gap-10'>
      <AddStudentModal />
      <ShowStudents />
    </div>
  )
}

export default page
