import AddGroupModal from './AddGroupModal'
import ShowGroups from './ShowGroups'

const page = () => {
  return (
    <div className='flex flex-col gap-6 p-4 container mx-auto'>
      {/* الهيدر */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div>
          <h1 className='text-2xl font-bold text-primary'>المجموعات</h1>
          <p className='text-sm text-muted-foreground'>إدارة المجموعات وتنظيم الطلاب</p>
        </div>

        <div className='w-full sm:w-auto'>
          <AddGroupModal />
        </div>
      </div>

      {/* المحتوى */}
      <ShowGroups />
    </div>
  )
}

export default page
