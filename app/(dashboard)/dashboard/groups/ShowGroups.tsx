import { getAllGroupsAction } from '@/actions/Group/getGroups'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTo12Hour } from '@/utils/formatTime'
import { Ban, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../../../components/ui/button'
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

export default async function ShowGroups() {
  const groups = await getAllGroupsAction()

  return (
    <div className='w-full px-4'>
      <div className='max-w-6xl w-full mx-auto rounded-lg border  shadow-sm overflow-hidden'>
        <Table className='text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50 hover:bg-muted/50'>
              <TableHead className='w-[200px]'>المجموعة</TableHead>
              <TableHead>نظام الدفع</TableHead>
              <TableHead>المواعيد</TableHead>
              <TableHead className='text-center w-[150px]'>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups.length > 0 ? (
              groups.map((group) => {
                const schedules = group.schedule || []

                return (
                  <TableRow key={group.id} className='hover:bg-muted/5 transition-colors'>
                    {/* اسم المجموعة */}
                    <TableCell className='font-medium text-lg'>
                      <Link
                        href={`/dashboard/groups/${group.id}`}
                        className='text-primary hover:underline underline-offset-4'
                      >
                        {group.name}
                      </Link>
                    </TableCell>

                    {/* السعر ونظام الدفع */}
                    <TableCell>
                      <div className='flex flex-col gap-1 items-start'>
                        <div className='flex items-center gap-1 text-sm font-semibold'>
                          <span>{group.price} ج.م</span>
                        </div>

                        <span className='text-xs text-muted-foreground'>
                          {group.paymentType === 'PER_SESSION' ? 'نظام الحصة' : 'نظام شهري'}
                        </span>
                      </div>
                    </TableCell>

                    {/* المواعيد */}
                    <TableCell>
                      <div className='flex flex-col  flex-wrap gap-1.5'>
                        {schedules.length > 0 ? (
                          schedules.map((item, idx) => (
                            <div
                              key={idx}
                              className='px-2 py-0.5 rounded-full border w-fit bg-secondary/30 text-xs flex items-center gap-1'
                            >
                              <span className='font-medium '>
                                {dayTranslation[item.dayOfWeek] || item.dayOfWeek}
                              </span>
                              <span className='opacity-40'>•</span>
                              <span className='flex items-center gap-1 dir-ltr'>
                                {formatTo12Hour(item.startTime)} - {formatTo12Hour(item.endTime)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className='text-muted-foreground text-sm italic opacity-50'>
                            بدون مواعيد
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell>
                      <div className='flex items-center justify-center gap-1'>
                        <Link
                          href={`/dashboard/groups/${group.id}`}
                          className='text-primary hover:underline underline-offset-4'
                        >
                          <Button size='icon'>
                            <Eye className='w-4 h-4' />
                          </Button>
                        </Link>
                        <UpdateGroupModal group={group} />
                        <RemoveGroup groupId={group.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-48 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                    <Ban className='w-8 h-8 opacity-20' />
                    <p>لا توجد مجموعات حتى الآن</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
