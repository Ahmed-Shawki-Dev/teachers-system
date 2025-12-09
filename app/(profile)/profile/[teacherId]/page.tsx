import TeacherProfile from './TeacherProfile'

export default async function Page({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = await params
  return (
    <section className=' w-full flex justify-center items-center relative z-50 '>
      <TeacherProfile teacherId={teacherId} />
    </section>
  )
}
