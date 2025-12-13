import { getMonthlySheet } from '@/actions/Payment/getMonthlySheet'
import { getUnpaidSessions } from '@/actions/Payment/getUnpaidSessions'
import { Ban } from 'lucide-react'
import MonthlyTable from './MonthlyTable'
import UnpaidTable from './UnpaidTable'

type Props = {
  groupId: string
  isMonthly: boolean
  month: string
  year: string
}

export default async function PaymentsList({ groupId, isMonthly, month, year }: Props) {
  if (!groupId) {
    return <div className='text-center py-10 text-muted-foreground'>اختر مجموعة لعرض البيانات</div>
  }

  if (isMonthly) {
    const monthlyData = await getMonthlySheet(groupId, `${month}-${year}`)

    if (!monthlyData) return <NoData />

    return (
      <MonthlyTable
        data={monthlyData.sheet}
        groupId={groupId}
        monthKey={`${month}-${year}`}
        amount={monthlyData.price}
      />
    )
  } else {
    const unpaidData = await getUnpaidSessions(groupId)

    if (!unpaidData) return <NoData />

    return <UnpaidTable data={unpaidData.debtList} price={unpaidData.price} groupId={groupId} />
  }
}

function NoData() {
  return (
    <div className='text-center py-10'>
      <Ban className='mx-auto mb-2 opacity-20' /> لا توجد بيانات
    </div>
  )
}
