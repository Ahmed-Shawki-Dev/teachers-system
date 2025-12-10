import { getDashboardStats } from '@/actions/Dashboard/getDashboardStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTo12Hour } from '@/utils/formatTime'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LucideIcon, // الأيقونة الجديدة
  PlusCircle,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { OverviewChart } from './OverviewChart'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className='flex flex-col gap-6 p-6 container mx-auto'>
      {/* 1. الهيدر الموحد الجديد */}
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-lg border shadow-sm'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 p-2 rounded-full text-primary'>
            <LayoutDashboard className='w-6 h-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-primary'>لوحة القيادة</h2>
            <p className='text-sm text-muted-foreground'>نظرة عامة على نشاطك وأرقامك الفعلية</p>
          </div>
        </div>

        {/* التاريخ */}
        <div className='text-sm font-medium bg-secondary px-4 py-2 rounded-full border flex items-center gap-2'>
          <span>
            {new Date().toLocaleDateString('ar-EG', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* 2. الكروت (أرقام حقيقية) */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='حصص اليوم'
          value={stats.todayClassesCount}
          description='حصة نشطة'
          icon={Clock}
          highlight
        />
        <StatCard
          title='المحصل هذا الشهر'
          value={`${stats.currentMonthIncome.toLocaleString()} ج.م`}
          description='إيرادات الخزنة'
          icon={Wallet}
        />
        <StatCard title='الطلاب' value={stats.studentsCount} description='طالب مسجل' icon={Users} />
        <StatCard
          title='المجموعات'
          value={stats.groupsCount}
          description='مجموعة دراسية'
          icon={GraduationCap}
        />
      </div>

      {/* 3. التقسيمة الرئيسية */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-7 items-start'>
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
    </div>
  )
}

// --- Components ---

interface StatCardProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
  highlight?: boolean
}

function StatCard({ title, value, description, icon: Icon, highlight }: StatCardProps) {
  return (
    <Card
      className={`shadow-sm transition-all hover:shadow-md ${
        highlight ? 'border-primary/50 bg-primary/5' : ''
      }`}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</div>
        <p className='text-xs text-muted-foreground mt-1'>{description}</p>
      </CardContent>
    </Card>
  )
}

interface QuickActionProps {
  href: string
  label: string
  icon: LucideIcon
}

function QuickActionButton({ href, label, icon: Icon }: QuickActionProps) {
  return (
    <Button
      variant='outline'
      asChild
      className='w-full justify-start h-12 text-base shadow-sm hover:border-primary/50 hover:bg-background'
    >
      <Link href={href}>
        <div className='bg-primary/10 p-1.5 rounded-full ml-3'>
          <Icon className='w-4 h-4 text-primary' />
        </div>
        {label}
      </Link>
    </Button>
  )
}
