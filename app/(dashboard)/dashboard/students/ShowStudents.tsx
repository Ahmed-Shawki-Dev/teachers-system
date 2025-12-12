import { Prisma } from '@prisma/client' // 👈 استورد Prisma Namespace
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Ban, Eye } from 'lucide-react'
import Link from 'next/link'
import RemoveStudent from './RemoveStudent'
import UpdateStudentModal from './UpdateStudentModal'
import { Button } from '../../../../components/ui/button'

// 🛑 تعريف الـ Type السحري:
// ده بيقول: أنا عايز نوع "طالب" بس كمان معاه الـ enrollments والجروب اللي جواها
type StudentWithGroup = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      include: {
        group: {
          select: { name: true; id: true } // حددنا الحقول اللي بنختارها في الأكشن
        }
      }
    }
  }
}>

type ShowStudentsProps = {
  students: StudentWithGroup[] // 👈 استخدمنا الـ Type الجديد بدل any
}

function ShowStudents({ students }: ShowStudentsProps) {
  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto rounded-lg border bg-background overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50 hover:bg-muted/50'>
              <TableHead className='w-[100px]'>الكود</TableHead>
              <TableHead>الإسم</TableHead>
              <TableHead>رقم ولي الأمر</TableHead>
              <TableHead>الصف</TableHead>
              <TableHead className='text-center'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.map((student) => {
              // دلوقتي TypeScript فاهم إن student جواه enrollments
              const enrollment = student.enrollments[0]
              const currentGroup = enrollment?.group
              const currentGroupId = enrollment?.groupId || ''

              return (
                <TableRow key={student.id}>
                  <TableCell className='font-mono font-bold text-sm text-primary/80'>
                    {student.studentCode}
                  </TableCell>

                  <TableCell>
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className='hover:underline hover:text-primary transition-colors cursor-pointer'
                    >
                      {student.name}
                    </Link>
                  </TableCell>
                  <TableCell>{student.parentPhone}</TableCell>
                  <TableCell>
                    {/* وفاهم إن currentGroup ممكن يكون null أو فيه name */}
                    {currentGroup ? currentGroup.name : 'بدون جروب'}
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2 justify-center'>
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className='text-primary hover:underline underline-offset-4'
                      >
                        <Button size='icon' variant='ghost'>
                          <Eye className='w-4 h-4' />
                        </Button>
                      </Link>
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
                <TableCell colSpan={5} className='h-40'>
                  <div className='text-center flex flex-col justify-center items-center gap-2 text-muted-foreground'>
                    <Ban className='opacity-50' />
                    <span>لا يوجد طلاب مطابقين للبحث</span>
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
