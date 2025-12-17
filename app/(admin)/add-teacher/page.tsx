import { notFound } from 'next/navigation'
import AddTeacherForm from './addTeacherForm'
import ShowTeachers from './ShowTeachers'
import { Separator } from '@/components/ui/separator'

export default async function AddTeacherPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>
}) {
  const { password } = await searchParams
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || '123456'

  // حماية بسيطة عشان محدش يدخل غيرك
  if (password !== ADMIN_PASS) {
    notFound()
  }

  return (
    <div className='min-h-screen bg-muted/10 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-extrabold tracking-tight text-primary'>لوحة تحكم الأدمن</h1>
          <p className='text-muted-foreground text-lg'>
            إدارة المدرسين، إضافة حسابات جديدة، ومتابعة النشاط.
          </p>
        </div>

        <Separator className='my-6' />

        {/* Main Grid Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Left Column: The Form (Sticky on Desktop) */}
          <div className='lg:col-span-4 xl:col-span-4'>
            <div className='lg:sticky lg:top-8 transition-all duration-500 ease-in-out'>
              <AddTeacherForm />
            </div>
          </div>

          {/* Right Column: The List */}
          <div className='lg:col-span-8 xl:col-span-8 space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold'>المدرسين الحاليين</h2>
              <span className='text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-mono'>
                Live Data
              </span>
            </div>

            <ShowTeachers />
          </div>
        </div>
      </div>
    </div>
  )
}
