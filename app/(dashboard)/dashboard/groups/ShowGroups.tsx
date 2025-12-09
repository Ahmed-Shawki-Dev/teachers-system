import { getAllGroupsAction } from '@/actions/Group/getGroups' // تأكد من المسار
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatTo12Hour } from '@/utils/formatTime' // تأكد من المسار
import { Ban, Clock, Coins, Eye } from 'lucide-react'
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
      <div className='max-w-6xl w-full mx-auto overflow-x-auto rounded-lg border bg-card shadow-sm'>
        <Table className='min-w-full text-right'>
          <TableHeader>
            <TableRow className='bg-muted/50'>
              <TableHead className='text-right font-bold w-[200px]'>المجموعة</TableHead>
              <TableHead className='text-right font-bold'>نظام الدفع</TableHead>
              <TableHead className='text-right font-bold'>المواعيد</TableHead>
              <TableHead className='text-center font-bold w-[120px]'>تعديل / حذف</TableHead>
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
                      <div className='flex flex-col gap-1'>
                        <Badge variant='outline' className='w-fit gap-1'>
                          <Coins className='w-3 h-3 text-yellow-600' />
                          {group.price} ج.م
                        </Badge>
                        <span className='text-xs text-muted-foreground font-medium'>
                          {group.paymentType === 'PER_SESSION' ? 'نظام الحصة' : 'نظام شهري'}
                        </span>
                      </div>
                    </TableCell>

                    {/* المواعيد */}
                    <TableCell>
                      <div className='flex flex-wrap gap-2'>
                        {schedules.length > 0 ? (
                          schedules.map((item, idx) => (
                            <div
                              key={idx}
                              className='flex items-center gap-1.5 bg-secondary/40 px-2 py-1 rounded border text-xs sm:text-sm'
                            >
                              <span className='font-semibold text-foreground'>
                                {dayTranslation[item.dayOfWeek] || item.dayOfWeek}
                              </span>
                              <span className='text-muted-foreground'>|</span>
                              <div className='flex items-center gap-1 dir-ltr'>
                                <Clock className='w-3 h-3 text-muted-foreground' />
                                <span className='font-mono'>{formatTo12Hour(item.startTime)}</span>
                                <span>-</span>
                                <span className='font-mono'>{formatTo12Hour(item.endTime)}</span>
                              </div>
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
                          <Button>
                            <Eye />
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
