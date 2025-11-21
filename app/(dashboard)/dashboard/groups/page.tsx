import AddGroupModal from './AddGroupModal'
import ShowGroups from './ShowGroups'

const page = () => {
  return (
    <div className='flex flex-col items-center gap-10'>
      <AddGroupModal />
      <ShowGroups />
    </div>
  )
}

export default page
