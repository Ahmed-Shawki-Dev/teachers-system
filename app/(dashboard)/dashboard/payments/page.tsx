import { getAllGroupsAction } from '@/actions/Group/getGroups'
import { getMonthlySheet } from '@/actions/Payment/getMonthlySheet'
import { getUnpaidSessions } from '@/actions/Payment/getUnpaidSessions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Ban, Wallet } from 'lucide-react'
import FilterSelect from './FilterSelect'
import MonthlyTable from './MonthlyTable'
import UnpaidTable from './UnpaidTable'
import { redirect } from 'next/navigation' // 👈 استيراد مهم

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ groupId?: string; month?: string; year?: string }>
}) {
  const params = await searchParams
  const groups = await getAllGroupsAction()

  // 1. حساب التواريخ
  const now = new Date()
  const currentMonth = (now.getMonth() + 1).toString()
  const currentYear = now.getFullYear()

  // 🛡️ SECURITY CHECK: URL Validation
  // لو السنة مبعوثة وتكون أكبر من السنة الجاية أو أقل من اللي فاتت، اطرده
  if (params.year) {
    const yearNum = parseInt(params.year)
    if (isNaN(yearNum) || yearNum > currentYear + 1 || yearNum < currentYear - 1) {
      // رجعه لنفس الصفحة بس شيل السنة من اللينك عشان ياخد الديفولت
      redirect(`/dashboard/payments?groupId=${params.groupId || ''}`)
    }
  }

  // 2. القائمة
  const yearOptions = [
    { value: (currentYear - 1).toString(), label: (currentYear - 1).toString() },
    { value: currentYear.toString(), label: currentYear.toString() },
    { value: (currentYear + 1).toString(), label: (currentYear + 1).toString() },
  ]

  const selectedGroupId = params.groupId || (groups.length > 0 ? groups[0].id : '')
  const selectedMonth = params.month || currentMonth
  const selectedYear = params.year || currentYear.toString()

  const selectedGroup = groups.find((g) => g.id === selectedGroupId)
  const isMonthly = selectedGroup?.paymentType === 'MONTHLY'

  let monthlyData = null
  let unpaidData = null

  if (selectedGroupId) {
    if (isMonthly) {
      monthlyData = await getMonthlySheet(selectedGroupId, `${selectedMonth}-${selectedYear}`)
    } else {
      unpaidData = await getUnpaidSessions(selectedGroupId)
    }
  }

  return (
    <div className='container mx-auto p-4 space-y-6'>
      {/* نفس الـ JSX بتاعك بالظبط بدون تغيير */}
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Wallet className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الماليات والتحصيل</h1>
            <p className='text-sm text-muted-foreground'>
              {selectedGroup ? `عرض ماليات مجموعة: ${selectedGroup.name}` : 'اختر مجموعة'}
            </p>
          </div>
        </div>

        <div className='flex gap-2 flex-wrap justify-center'>
          {isMonthly && (
            <>
              <FilterSelect
                paramKey='month'
                options={Array.from({ length: 12 }, (_, i) => ({
                  value: (i + 1).toString(),
                  label: `شهر ${i + 1}`,
                }))}
                defaultValue={selectedMonth}
              />
              <FilterSelect paramKey='year' options={yearOptions} defaultValue={selectedYear} />
            </>
          )}
          <FilterSelect
            paramKey='groupId'
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
            defaultValue={selectedGroupId}
            placeholder='اختر المجموعة'
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between items-center'>
            {isMonthly ? (
              <span>
                تحصيل شهر {selectedMonth} / {selectedYear}
              </span>
            ) : (
              <span className='flex items-center gap-2 text-red-600'>
                <AlertCircle className='w-5 h-5' />
                قائمة المتأخرات (المديونيات)
              </span>
            )}

            {selectedGroup && (
              <Badge variant='outline' className='gap-1 text-sm font-normal'>
                {isMonthly ? 'نظام شهري' : 'نظام بالحصة'} - {selectedGroup.price} ج.م
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {!selectedGroupId ? (
            <div className='text-center py-10 text-muted-foreground'>اختر مجموعة لعرض البيانات</div>
          ) : isMonthly && monthlyData ? (
            <MonthlyTable
              data={monthlyData.sheet}
              groupId={selectedGroupId}
              monthKey={`${selectedMonth}-${selectedYear}`}
              amount={monthlyData.price}
            />
          ) : unpaidData ? (
            <UnpaidTable
              data={unpaidData.debtList}
              price={unpaidData.price}
              groupId={selectedGroupId}
            />
          ) : (
            <div className='text-center py-10'>
              <Ban className='mx-auto mb-2 opacity-20' /> لا توجد بيانات
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
