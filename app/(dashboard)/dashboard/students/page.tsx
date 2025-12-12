import { getAllGroupsAction } from '@/actions/Group/getGroups'
import { getAllStudentsAction } from '@/actions/Student/getStudents' // 🛑 استوردنا الأكشن هنا
import StudentSearchInput from '@/components/StudentSearchInput'
import PaginationControl from '@/components/ui/PaginationControl' // تأكد من المسار
import { GraduationCap } from 'lucide-react'
import AddStudentModal from './AddStudentModal'
import ShowStudents from './ShowStudents'
import StudentsFilter from './StudentsFilter'

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; groupId?: string; page?: string }>
}) {
  const params = await searchParams

  const query = params.query || ''
  const groupId = params.groupId || ''
  const page = Number(params.page) || 1

  // 2. جلب المجموعات للفلتر
  const groups = await getAllGroupsAction()

  // 3. جلب الطلاب + الميتاداتا (الأكشن اللي عدلناه من شوية)
  // لاحظ بعتنا الـ page والـ pageSize (مثلاً 10)
  const { data: students, metadata } = await getAllStudentsAction(page, 20, query, groupId)

  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <GraduationCap className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الطلاب</h1>
            <p className='text-sm text-muted-foreground'>العدد الكلي: {metadata.totalCount} طالب</p>
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

      {/* 4. تمرير الطلاب للجدول */}
      <div className='space-y-4 flex flex-col items-center'>
        {/* السيرش شغال لأنه بيحدث الـ URL */}

        {/* 🛑 هنا التغيير: مررنا الداتا للجدول */}
        <ShowStudents students={students} />

        {/* 🛑 وضفنا الباجينيشن عشان لو الجروب فيه 1000 طالب */}
        <PaginationControl totalPages={metadata.totalPages} currentPage={metadata.currentPage} />
      </div>
    </div>
  )
}
