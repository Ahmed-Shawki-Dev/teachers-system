// app/(dashboard)/dashboard/DashboardData.tsx
// 👑 ده Server Component (ده اللي فيه التأخير بتاع DB/Cold Start)

import { getDashboardStats } from '@/actions/Dashboard/getDashboardStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTo12Hour } from '@/utils/formatTime'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  PlusCircle,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import { OverviewChart } from './OverviewChart'
import { QuickActionButton, StatCard } from './components'
// استدعاء المكونات الفرعية اللي كانت موجودة في الـ page.tsx الأصلي

export default async function DashboardData() {
  unstable_noStore() // 🛑 لمنع الـ Caching القاتل في فيرسل

  // 🛑 كل التأخير هيحصل هنا، لكن الـ Suspense هيغطيه
  const stats = await getDashboardStats()

  return (
    <>
      {/* 2. الكروت (أرقام حقيقية) - تم نقلها من page.tsx */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='حصص اليوم'
          value={stats.todayClassesCount}
          description='حصة نشطة'
          icon={Clock}
        />
        <StatCard
          title='المستحقات المتأخرة'
          value={`${stats.totalPendingAmount.toLocaleString()} ج.م`}
          description={`${stats.totalLaggardStudents} طالب متأخر`}
          icon={CreditCard}
        />
        <StatCard
          title='المحصل هذا الشهر'
          value={`${stats.currentMonthIncome.toLocaleString()} ج.م`}
          description='إيرادات الخزنة'
          icon={Wallet}
        />
        <StatCard
          title='الطلاب'
          value={stats.studentsCount} // 👑 ده الأهم
          description='طالب مسجل'
          icon={Users}
        />
      </div>

      {/* 3. التقسيمة الرئيسية */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7 items-start mt-6'>
        {/* العمود الجانبي */}
        <div className='col-span-1 lg:col-span-3 flex flex-col gap-6 h-full'>
          {/* جدول اليوم */}
          <Card className='flex-1 shadow-sm border-t-4 border-t-primary'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='w-5 h-5 text-muted-foreground' />
                جدول اليوم
              </CardTitle>
              <CardDescription>لديك {stats.todayClassesCount} حصص نشطة</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.todayClasses.length > 0 ? (
                <div className='space-y-3'>
                  {stats.todayClasses.map((session) => (
                    <Link
                      key={session.id}
                      href={`/dashboard/sessions/${session.id}`}
                      className='flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 hover:border-primary/30 transition-all group'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold text-xs shadow-sm'>
                          <span>
                            {new Date(session.sessionDate).toLocaleTimeString('en-US', {
                              hour12: false,
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div>
                          <p className='text-sm font-bold group-hover:text-primary transition-colors'>
                            {session.group.name}
                          </p>
                          <p className='text-xs text-muted-foreground mt-0.5 flex items-center gap-1'>
                            <Clock className='w-3 h-3' />
                            {formatTo12Hour(
                              new Date(session.sessionDate).toLocaleTimeString('en-US', {
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                              }),
                            )}
                          </p>
                        </div>
                      </div>
                      <ArrowLeft className='w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all' />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className='h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-muted/5 rounded-lg border border-dashed'>
                  <Calendar className='w-8 h-8 mb-2 opacity-20' />
                  <p className='text-sm font-medium'>لا توجد حصص اليوم</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* إجراءات سريعة */}
          <Card className='border-primary/20 bg-primary/5 shadow-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='text-primary flex items-center gap-2 text-lg'>
                <Zap className='w-5 h-5' /> إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className='grid gap-2'>
              <QuickActionButton
                href='/dashboard/students?action=add'
                label='إضافة طالب جديد'
                icon={PlusCircle}
              />
              <QuickActionButton href='/dashboard/payments' label='تحصيل مصروفات' icon={Wallet} />
              <QuickActionButton
                href='/dashboard/exams'
                label='رصد درجات امتحان'
                icon={GraduationCap}
              />
            </CardContent>
          </Card>
        </div>

        {/* الرسم البياني */}
        <Card className='col-span-1 lg:col-span-4 shadow-sm h-full'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='w-5 h-5 text-muted-foreground' />
              تحليل الإيرادات
            </CardTitle>
            <CardDescription>متابعة التحصيلات الشهرية الفعلية</CardDescription>
          </CardHeader>
          <CardContent className='pl-0 pr-4 '>
            <OverviewChart data={stats.chartData} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
