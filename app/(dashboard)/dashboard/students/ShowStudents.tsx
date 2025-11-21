import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllStudentsAction } from '../../../../actions/Student/getStudents'
import RemoveStudent from './RemoveStudent'
import UpdateStudentModal from './UpdateStudentModal'
async function ShowStudents() {
  const students = await getAllStudentsAction()
  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto overflow-x-auto rounded-lg border bg-background p-4'>
        <Table className='min-w-full text-right'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-right font-black'>الإسم</TableHead>
              <TableHead className='text-right font-black'>رقم ولي الأمر</TableHead>
              <TableHead className='text-right font-black'>الصف</TableHead>
              <TableHead className='text-center font-black'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const currentGroup = student.enrollments[0]?.group

              return (
                <TableRow key={student.id}>
                  <TableCell className='font-bold'>{student.name}</TableCell>
                  <TableCell>{student.parentPhone}</TableCell>
                  <TableCell className='text-primary font-semibold'>
                    {currentGroup ? `${currentGroup.name} ` : 'بدون جروب'}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center'>
                      <UpdateStudentModal studentId={student.id} />
                      <RemoveStudent studentId={student.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ShowStudents
