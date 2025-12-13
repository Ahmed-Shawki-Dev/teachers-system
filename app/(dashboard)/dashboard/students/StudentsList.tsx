import { getAllStudentsAction } from '@/actions/Student/getStudents'
import PaginationControl from '@/components/ui/PaginationControl'
import ShowStudents from './ShowStudents'

type Props = {
  page: number
  query: string
  groupId: string
}

export default async function StudentsList({ page, query, groupId }: Props) {
  // الـ Fetch التقيل بيحصل هنا
  const { data: students, metadata } = await getAllStudentsAction(page, 20, query, groupId)

  return (
    <div className='space-y-4 flex flex-col items-center w-full'>
      {/* الجدول */}
      <ShowStudents students={students} />

      {/* الباجينيشن + العداد */}
      <div className='w-full flex flex-col items-center gap-2'>
        <p className='text-xs text-muted-foreground'>إجمالي عدد الطلاب: {metadata.totalCount}</p>
        <PaginationControl totalPages={metadata.totalPages} currentPage={metadata.currentPage} />
      </div>
    </div>
  )
}
