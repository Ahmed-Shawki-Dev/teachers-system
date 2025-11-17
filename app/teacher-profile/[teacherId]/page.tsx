import TeacherProfile from './TeacherProfile'

export default async function Page({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = await params
  return (
    <section className='h-screen w-full flex justify-center items-center'>
      <TeacherProfile teacherId={teacherId} />
    </section>
  )
}
