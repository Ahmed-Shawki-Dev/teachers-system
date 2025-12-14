import { getAllGroupsAction } from '@/actions/Group/getGroups'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getFullGroupName } from '@/utils/groupName' // 💡 استيراد الدالة
import { AlertCircle, Wallet } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import FilterSelect from './FilterSelect'
import PaymentsList from './PaymentsList'
import PaymentsSkeleton from './PaymentsSkeleton'

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

  // 🛡️ Validation
  if (params.year) {
    const yearNum = parseInt(params.year)
    if (isNaN(yearNum) || yearNum > currentYear + 1 || yearNum < currentYear - 1) {
      redirect(`/dashboard/payments?groupId=${params.groupId || ''}`)
    }
  }

  // 2. إعدادات الفلتر
  const yearOptions = [
    {
      value: (currentYear - 1).toString(),
      label: (currentYear - 1).toString(),
    },
    { value: currentYear.toString(), label: currentYear.toString() },
    {
      value: (currentYear + 1).toString(),
      label: (currentYear + 1).toString(),
    },
  ]

  const selectedGroupId = params.groupId || (groups.length > 0 ? groups[0].id : '')
  const selectedMonth = params.month || currentMonth
  const selectedYear = params.year || currentYear.toString()

  // تحديد المجموعة المختارة ونوعها (ده سريع جداً لانه من الذاكرة)
  const selectedGroup = groups.find((g) => g.id === selectedGroupId)
  const isMonthly = selectedGroup?.paymentType === 'MONTHLY'
  return (
    <div className='container mx-auto p-4 space-y-6'>
      {/* Header Section (بيظهر فوراً) */}
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <Wallet className='w-6 h-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-primary'>الماليات والتحصيل</h1>
            <p className='text-sm text-muted-foreground'>
              {selectedGroup
                ? `عرض ماليات مجموعة: ${getFullGroupName({
                    grade: selectedGroup.grade,
                    name: selectedGroup.name,
                  })}`
                : 'اختر مجموعة'}
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
            // 🛑 الخطأ هنا: يجب استخدام g (المجموعة الحالية في الـ loop) وليس selectedGroup
            options={groups.map((g) => ({
              value: g.id,
              // 💡 التصحيح المنطقي والنوعي
              label: getFullGroupName({
                grade: g.grade, 
                name: g.name, 
              }),
            }))}
            defaultValue={selectedGroupId}
            placeholder='اختر المجموعة'
          />
        </div>
      </div>

      {/* Card Container */}
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
          {/* هنا السحر: الجدول بيحمل لوحده */}
          <Suspense
            key={selectedGroupId + selectedMonth + selectedYear}
            fallback={<PaymentsSkeleton />}
          >
            <PaymentsList
              groupId={selectedGroupId}
              isMonthly={!!isMonthly}
              month={selectedMonth}
              year={selectedYear}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
