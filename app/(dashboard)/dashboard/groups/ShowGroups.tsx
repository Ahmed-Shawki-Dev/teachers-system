import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Ban } from 'lucide-react'
import { getAllGroupsAction } from '../../../../actions/Group/getGroups'
import { formatTo12Hour } from '../../../../utils/formatTime'
import RemoveGroup from './RemoveGroup'
import UpdateGroupModal from './UpdateGroupModal'

const dayTranslation: Record<string, string> = {
  SUNDAY: 'الأحد',
  MONDAY: 'الاثنين',
  TUESDAY: 'الثلاثاء',
  WEDNESDAY: 'الأربعاء',
  THURSDAY: 'الخميس',
  FRIDAY: 'الجمعة',
  SATURDAY: 'السبت',
}

async function ShowGroups() {
  const groups = await getAllGroupsAction()

  return (
    <div className='w-full px-4'>
      <div className='max-w-5xl w-full mx-auto overflow-x-auto rounded-lg border bg-background p-4'>
        <Table className='min-w-full text-right'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-right font-black w-[200px]'>اسم المجموعة</TableHead>
              <TableHead className='text-right font-black'>المواعيد</TableHead>
              <TableHead className='text-center font-black w-[150px]'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className='font-bold text-lg'>{group.name}</TableCell>

                <TableCell>
                  <div className='flex flex-wrap gap-2'>
                    {group.schedule.length > 0 ? (
                      group.schedule.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-md border text-sm'
                        >
                          <span className='font-bold text-primary'>
                            {dayTranslation[item.dayOfWeek] || item.dayOfWeek}
                          </span>
                          <span className='text-muted-foreground text-xs'>|</span>
                          <span dir='ltr' className='font-mono text-xs'>
                            {formatTo12Hour(item.startTime)} - {formatTo12Hour(item.endTime)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className='text-muted-foreground text-sm italic'>بدون مواعيد</span>
                    )}
                  </div>
                </TableCell>

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

        {groups.length === 0 && (
          <div className='text-center py-10 text-muted-foreground flex flex-col justify-center items-center gap-2'>
            <Ban />
            <span>لا توجد أي مجموعة</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowGroups
