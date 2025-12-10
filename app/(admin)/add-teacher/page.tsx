import { notFound } from 'next/navigation'
import AddTeacherForm from './addTeacherForm'
import ShowTeachers from './ShowTeachers'

export default async function AddTeacherPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>
}) {
  const { password } = await searchParams
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || '123456'

  if (password !== ADMIN_PASS) {
    notFound()
  }

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center gap-10'>
      <AddTeacherForm />
      <ShowTeachers />
    </div>
  )
}
