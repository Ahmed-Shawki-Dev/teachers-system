import { getGroupDetails } from '@/actions/Group/getGroupDetails'
import { getAllStudentsAction } from '@/actions/Student/getStudents' // 1. استيراد الأكشن
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DayOfWeek } from '@prisma/client'
import { Calendar, Clock, Users, Wallet } from 'lucide-react'
import StudentSearchInput from '../../../../../components/StudentSearchInput'
import ShowStudents from '../../students/ShowStudents'
import PaginationControl from '@/components/ui/PaginationControl' // 2. استيراد الباجينيشن

// دالة الترجمة (زي ما هي)
const translateDay = (day: DayOfWeek) => {
  const days: Record<string, string> = {
    SUNDAY: 'الأحد',
    MONDAY: 'الاثنين',
    TUESDAY: 'الثلاثاء',
    WEDNESDAY: 'الأربعاء',
    THURSDAY: 'الخميس',
    FRIDAY: 'الجمعة',
    SATURDAY: 'السبت',
  }
  return days[day] || day
}

export default async function GroupDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>
  searchParams: Promise<{ query?: string; page?: string }> // زودنا page
}) {
  const { groupId } = await params
  const { query, page: pageParam } = await searchParams

  const page = Number(pageParam) || 1
  const queryStr = query || ''

  // 1. هات بيانات المجموعة
  const group = await getGroupDetails(groupId)

  // 2. 🛑 هات طلاب المجموعة دي بس (Server Side Fetching)
  // بعتنا groupId عشان يفلتر، وبعتنا page عشان الباجينيشن
  const { data: students, metadata } = await getAllStudentsAction(
    page,
    20,
    queryStr,
    groupId, // 👈 أهم نقطة: بنجبره يجيب طلاب الجروب ده بس
  )

  return (
    <div className='flex flex-col gap-8 p-4 container mx-auto'>
      {/* القسم العلوي: تفاصيل المجموعة (زي ما هو) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-2 border-t-4 border-t-primary'>
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              <span className='text-2xl font-bold text-primary'>{group.name}</span>
              <Badge variant='secondary' className='text-sm px-3'>
                <Users className='w-4 h-4 ml-1 inline' />
                {group._count.enrollments} طالب
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2 text-muted-foreground bg-muted/20 p-3 rounded-lg w-fit'>
              <Wallet className='w-5 h-5 text-green-600' />
              <span className='font-semibold text-foreground'>{group.price} ج.م</span>
              <span className='text-xs'>
                / {group.paymentType === 'MONTHLY' ? 'للشهر' : 'للحصة'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* كارت المواعيد */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-primary' />
              المواعيد الأسبوعية
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {group.schedule.length > 0 ? (
              group.schedule.map((sch) => (
                <div
                  key={sch.id}
                  className='flex justify-between items-center p-2 bg-muted/30 rounded border'
                >
                  <span className='font-bold'>{translateDay(sch.dayOfWeek)}</span>
                  <div className='flex items-center gap-1 text-sm text-muted-foreground' dir='ltr'>
                    <Clock className='w-3 h-3' />
                    {sch.startTime} - {sch.endTime}
                  </div>
                </div>
              ))
            ) : (
              <p className='text-muted-foreground text-sm text-center py-4'>لا توجد مواعيد مسجلة</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* القسم السفلي: جدول الطلاب */}
      <h2 className='text-xl font-bold border-r-4 border-primary pr-3'>طلاب المجموعة</h2>
      <div className='space-y-4 flex flex-col items-center'>
        {/* السيرش شغال لأنه بيحدث الـ URL */}
        <StudentSearchInput />

        {/* 🛑 هنا التغيير: مررنا الداتا للجدول */}
        <ShowStudents students={students} />

        {/* 🛑 وضفنا الباجينيشن عشان لو الجروب فيه 1000 طالب */}
        <PaginationControl totalPages={metadata.totalPages} currentPage={metadata.currentPage} />
      </div>
    </div>
  )
}
