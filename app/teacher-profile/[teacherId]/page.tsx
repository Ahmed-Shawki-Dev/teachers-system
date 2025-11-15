export default async function Page({ params }: { params: Promise<{ teacherId: string }> }) {
  const { teacherId } = await params
  return <div>البوست: {teacherId}</div>
}
