import { Prisma } from '@/lib/prisma'
import { getFullGroupName } from '@/utils/groupName'
import { Metadata } from 'next'
import { Libre_Barcode_39 } from 'next/font/google'
import { notFound } from 'next/navigation'

// 1. إعداد خط الباركود
const barcodeFont = Libre_Barcode_39({
  weight: '400',
  subsets: ['latin'],
})

// تعريف النوع للـ Params عشان نستخدمه في الدالتين
type Props = {
  params: Promise<{ studentCode: string }>
}

// 2. ✅ دالة الميتاداتا: دي اللي بتخلي اسم الملف PDF يطلع بكود الطالب
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { studentCode } = await params
  return {
    title: studentCode, // اسم الصفحة = اسم الملف عند الحفظ
  }
}

// 3. صفحة الطباعة
export default async function PrintStudentCard({ params }: Props) {
  const { studentCode } = await params

  // جلب بيانات الطالب
  const student = await Prisma.student.findUnique({
    where: { studentCode: studentCode },
    include: {
      teacher: true,
      enrollments: {
        include: {
          group: true,
        },
      },
    },
  })

  if (!student) return notFound()

  // تظبيط اسم المجموعة
  const mainGroup = student.enrollments[0]?.group
  const groupName = mainGroup
    ? getFullGroupName({ name: mainGroup.name, grade: mainGroup.grade })
    : 'بدون مجموعة'

  return (
    <>
      <style>{`
        /* إعدادات الطباعة لمقاس الكارنيه (CR80) */
        @media print {
          @page {
            size: 86mm 54mm; /* مقاس الكارنيه الاستاندرد */
            margin: 0;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 86mm;
            height: 54mm;
            overflow: hidden !important;
          }

          /* إخفاء كل عناصر الصفحة */
          body * {
            visibility: hidden;
          }

          /* إظهار الكارنيه فقط */
          #print-card-container {
            visibility: visible !important;
            position: fixed;
            left: 0;
            top: 0;
            width: 86mm;
            height: 54mm;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            z-index: 9999;
          }

          #print-card-container * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;   /* إجبار الألوان */
            print-color-adjust: exact !important;
          }
          
          /* تعديل الكونتينر ليملأ الورقة تماماً */
          .card-box {
             border: none !important;
             width: 100% !important;
             height: 100% !important;
             border-radius: 0 !important;
             box-shadow: none !important;
          }
        }
      `}</style>

      {/* الشاشة الظاهرة للمستخدم قبل الطباعة */}
      <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
        <div id='print-card-container'>
          {/* تصميم الكارنيه */}
          <div className='card-box w-[350px] h-[220px] bg-white border-2 border-black rounded-xl relative overflow-hidden flex flex-col shadow-xl print:shadow-none'>
            {/* Header */}
            <div className='bg-slate-900 text-white px-3 py-2 flex justify-between items-center h-[45px]'>
              <div className='font-bold text-lg truncate max-w-[250px] uppercase'>
                مستر. {student.teacher.name}
              </div>
            </div>

            {/* Body */}
            <div className='flex-1 px-3 py-2 flex flex-col justify-center gap-1'>
              <div className='mb-0.5'>
                <h2 className='text-xl font-black leading-tight truncate text-slate-800'>
                  {student.name}
                </h2>
              </div>

              <div className='flex justify-between items-end mt-1'>
                <div className='flex items-center gap-1 text-xs font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200'>
                  <span>{groupName}</span>
                </div>
                <div className='text-[10px] font-mono font-bold text-slate-500'>
                  {student.parentPhone}
                </div>
              </div>
            </div>

            {/* Footer: Barcode */}
            <div className='bg-white pb-2 flex flex-col items-center justify-center'>
              <div
                className={`${barcodeFont.className} transform scale-y-125 origin-bottom`}
                style={{ fontSize: '48px', lineHeight: 0.8 }}
              >
                *{student.studentCode}*
              </div>
              <div className='text-[10px] font-mono tracking-[0.3em] font-black mt-1'>
                {student.studentCode}
              </div>
            </div>

            {/* Decor Elements (Hidden in print) */}
            <div className='absolute -top-6 -right-6 w-16 h-16 bg-slate-900/5 rounded-full blur-xl print:hidden' />
          </div>
        </div>

        {/* سكربت الطباعة التلقائي */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onload = function() {
                // تأخير بسيط لضمان تحميل الخطوط
                setTimeout(() => {
                    window.print();
                }, 500);
              }
            `,
          }}
        />
      </div>
    </>
  )
}
