import { Clock10 } from 'lucide-react'
import AddGroupModal from './AddGroupModal'
import ShowGroups from './ShowGroups'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Clock10 className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>المجموعات الدراسية</h1>
            <p className='text-sm text-muted-foreground'>إدارة المجموعات والمواعيد الدراسية</p>
          </div>
        </div>

        <div className='w-full sm:w-auto'>
          <AddGroupModal />
        </div>
      </div>

      <ShowGroups />
    </div>
  )
}

export default page
