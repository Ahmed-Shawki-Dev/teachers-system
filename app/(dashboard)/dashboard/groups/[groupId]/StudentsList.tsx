import { getAllStudentsAction } from '@/actions/Student/getStudents'
import PaginationControl from '@/components/ui/PaginationControl'
// تأكد إن المسار ده صح عندك، أنا ظبطته بناء على ملفاتك
import ShowStudents from '../../students/ShowStudents'

type Props = {
  groupId: string
  page: number
  query: string
}

export default async function StudentsList({ groupId, page, query }: Props) {
  // هنا الـ Fetching التقيل
  const { data: students, metadata } = await getAllStudentsAction(page, 20, query, groupId)

  return (
    <div className='space-y-4 flex flex-col items-center w-full'>
      {/* الجدول */}
      <ShowStudents students={students} />

      {/* الباجينيشن */}
      <PaginationControl totalPages={metadata.totalPages} currentPage={metadata.currentPage} />
    </div>
  )
}
