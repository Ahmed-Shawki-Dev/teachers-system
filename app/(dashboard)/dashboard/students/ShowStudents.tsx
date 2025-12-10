import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Ban } from 'lucide-react'
import { getAllStudentsAction } from '../../../../actions/Student/getStudents'
import RemoveStudent from './RemoveStudent'
import UpdateStudentModal from './UpdateStudentModal'
import Link from 'next/link'

type ShowStudentsProps = {
  search?: string
  groupId?: string
  grade?: string
}

async function ShowStudents({ search, groupId, grade }: ShowStudentsProps) {
  const students = await getAllStudentsAction(search, groupId, grade)

  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto rounded-lg border bg-background overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50 hover:bg-muted/50'>
              <TableHead>الإسم</TableHead>
              <TableHead>رقم ولي الأمر</TableHead>
              <TableHead>الصف</TableHead>
              <TableHead className='text-center'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              const enrollment = student.enrollments[0]
              const currentGroup = enrollment?.group
              const currentGroupId = enrollment?.groupId || ''

              return (
                <TableRow key={student.id}>
                  <TableCell className='font-bold text-base'>
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className='hover:underline hover:text-primary transition-colors cursor-pointer'
                    >
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell>{student.parentPhone}</TableCell>
                  <TableCell className='text-primary font-semibold'>
                    {currentGroup ? currentGroup.name : 'بدون جروب'}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center'>
                      <UpdateStudentModal
                        studentId={student.id}
                        initialData={{
                          name: student.name,
                          parentPhone: student.parentPhone,
                          groupId: currentGroupId,
                        }}
                      />
                      <RemoveStudent studentId={student.id} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className='h-40'>
                  <div className='text-center flex flex-col justify-center items-center gap-2 text-muted-foreground'>
                    <Ban className='opacity-50' />
                    <span>لا يوجد أي طلاب</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ShowStudents
