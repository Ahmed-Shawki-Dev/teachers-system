import { Settings } from 'lucide-react'
import ChangePasswordForm from './ChangePasswordForm'

const page = () => {
  return (
    <div className='container mx-auto p-4 space-y-6'>
      {/* نفس الـ JSX بتاعك بالظبط بدون تغيير */}
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Settings className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الإعدادات</h1>
            <p className='text-sm text-muted-foreground'>اعدادات النظام</p>
          </div>
        </div>
      </div>
      <ChangePasswordForm />
    </div>
  )
}

export default page
