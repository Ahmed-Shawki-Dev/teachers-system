import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllGroupsAction } from '../../../../actions/Group/getGroups'
import RemoveGroup from './RemoveGroup'
import UpdateGroupModal from './UpdateGroupModal'

async function ShowGroups() {
  const groups = await getAllGroupsAction()
  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto overflow-x-auto rounded-lg border bg-background p-4'>
        <Table className='min-w-full text-right'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-right font-black'>الصف</TableHead>
              <TableHead className='text-center font-black'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>
                  <div className='flex gap-2 justify-center'>
                    <UpdateGroupModal groupId={group.id} />
                    <RemoveGroup groupId={group.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ShowGroups
