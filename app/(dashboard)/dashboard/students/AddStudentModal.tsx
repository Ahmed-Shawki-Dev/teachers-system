'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
// ✅ ضفنا Crown للأيقونات
import { CheckCircle2, Copy, Crown, Loader, Lock, PlusCircle, Printer } from 'lucide-react'
import { Libre_Barcode_39 } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { addStudentAndEnrollAction } from '../../../../actions/Enrollment/addStudentToGroup'
import { getAllGroupsAction } from '../../../../actions/Group/getGroups'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form'
import { Input } from '../../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import { IGroupDB } from '../../../../interfaces/groups'
import { getFullGroupName } from '../../../../utils/groupName'
import { IStudent, studentSchema } from '../../../../validation/studentSchema'

const barcodeFont = Libre_Barcode_39({
  weight: '400',
  subsets: ['latin'],
})

// ✅ بنستقبل البروب هنا (default = false للأمان)
export default function AddStudentModal({ isLimitReached = false }: { isLimitReached?: boolean }) {
  const [groups, setGroups] = useState<IGroupDB[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const [successData, setSuccessData] = useState<{
    id: string
    name: string
    code: string
    canPrint: boolean
  } | null>(null)

  const form = useForm<IStudent>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: '', parentPhone: '', groupId: '' },
  })

  // ريسيت للفورم لما يقفل
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setSuccessData(null)
        form.reset()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, form])

  // تحميل الجروبات
  useEffect(() => {
    if (open && !hasFetched && !isLimitReached) {
      // ممكن منعملش fetch لو الليمت واصل توفيراً للريكوستات
      getAllGroupsAction().then((data) => {
        setGroups(data)
        setHasFetched(true)
      })
    }
  }, [open, hasFetched, isLimitReached])

  const handlePrintCard = () => {
    if (successData?.id && successData.canPrint) {
      const url = `/print/student/${successData.code}`
      window.open(
        url,
        'PrintStudentCard',
        'width=600,height=600,scrollbars=no,toolbar=no,location=no',
      )
    }
  }

  const copyCode = () => {
    if (successData?.code) {
      navigator.clipboard.writeText(successData.code)
      toast.success('تم نسخ كود الطالب')
    }
  }

  async function onSubmit(data: IStudent) {
    try {
      setLoading(true)
      const result = await addStudentAndEnrollAction(data)
      toast.success('تم إضافة الطالب بنجاح')

      setSuccessData({
        id: result.student.id,
        name: result.student.name,
        code: result.studentCode,
        canPrint: result.allowPrinting ?? false,
      })
      form.reset()
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('PLAN_LIMIT_REACHED')) {
          toast.error(
            <div className='flex flex-col gap-1'>
              <span className='font-bold'>عفواً، لقد وصلت للحد الأقصى!</span>
              <span className='text-xs'>يرجى الترقية لإضافة المزيد.</span>
            </div>,
          )
          return
        }
      }

      toast.error('حصل خطأ أثناء الإضافة')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* ✅ تغيير شكل الزرار لو الليمت وصل */}
        <Button variant={isLimitReached ? 'destructive' : 'default'}>
          {isLimitReached ? (
            <>
              <Lock className='mr-2 h-4 w-4' /> الترقية مطلوبة
            </>
          ) : (
            <>
              <PlusCircle className='mr-2 h-4 w-4' /> أضف طالب
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[450px] transition-all duration-300'>
        {/* ================= الحالة 0: الليمت وصل (Blocking UI) ================= */}
        {isLimitReached ? (
          <div className='flex flex-col items-center justify-center py-6 text-center space-y-4 animate-in zoom-in-95'>
            <div className='bg-red-100 p-4 rounded-full shadow-inner'>
              <Crown className='h-10 w-10 text-red-600' />
            </div>
            <div className='space-y-2'>
              <DialogTitle className='text-xl font-bold text-red-700'>
                عفواً، لقد وصلت للحد الأقصى!
              </DialogTitle>
              <DialogDescription className='max-w-[80%] mx-auto'>
                باقتك الحالية لا تسمح بإضافة المزيد من الطلاب. يرجى التواصل مع الإدارة لترقية حسابك
                والاستمتاع بمميزات بلا حدود.
              </DialogDescription>
            </div>

            <div className='flex gap-3 w-full pt-4'>
              <DialogClose asChild>
                <Button variant='outline' className='flex-1'>
                  إغلاق
                </Button>
              </DialogClose>
              {/* زرار وهمي للترقية (ممكن توديه صفحة تواصل او واتساب) */}
              {/* <Button className='flex-1 bg-red-600 hover:bg-red-700'>ترقية الآن</Button> */}
            </div>
          </div>
        ) : (
          // ================= الحالات العادية (فورم أو نجاح) =================
          <>
            {!successData ? (
              // --- الفورم ---
              <>
                <DialogHeader>
                  <DialogTitle className='text-center text-xl'>إضافة طالب جديد</DialogTitle>
                  <DialogDescription className='text-center'>
                    أدخل بيانات الطالب ليتم تسجيله في النظام.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    id='form-add-student'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 py-4'
                  >
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم الثلاثي</FormLabel>
                          <FormControl>
                            <Input placeholder='مثال: أحمد محمد علي' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='parentPhone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم ولي الأمر</FormLabel>
                          <FormControl>
                            <Input placeholder='01xxxxxxxxx' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='groupId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المجموعة / الصف</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder='اختر المجموعة' />
                              </SelectTrigger>
                              <SelectContent className='max-h-60 overflow-auto'>
                                {groups.map((group) => (
                                  <SelectItem key={group.id} value={group.id}>
                                    {getFullGroupName({ grade: group.grade, name: group.name })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter className='mt-6 flex gap-2'>
                      <DialogClose asChild>
                        <Button variant='outline' type='button' className='flex-1'>
                          إلغاء
                        </Button>
                      </DialogClose>
                      <Button type='submit' disabled={loading} className='flex-1'>
                        {loading ? <Loader className='animate-spin h-4 w-4' /> : 'حفظ'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </>
            ) : (
              // --- النجاح ---
              <div className='flex flex-col items-center justify-center space-y-6 py-2 animate-in fade-in zoom-in duration-300'>
                <div className='flex flex-col items-center text-center gap-2'>
                  <div className='h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm'>
                    <CheckCircle2 size={36} />
                  </div>
                  <DialogTitle className='text-xl text-green-700 font-bold'>
                    تم تسجيل الطالب بنجاح
                  </DialogTitle>
                  <p className='text-lg font-medium text-foreground'>{successData.name}</p>
                </div>

                {successData.canPrint ? (
                  <>
                    <div className='w-full bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center gap-4 relative'>
                      <div className={`${barcodeFont.className} text-5xl transform scale-y-125`}>
                        *{successData.code}*
                      </div>

                      <div className='flex items-center gap-2 bg-white px-3 py-1.5 rounded border shadow-sm text-sm font-mono text-slate-700 font-bold'>
                        {successData.code}
                        <button
                          onClick={copyCode}
                          className='hover:text-primary transition-colors p-1 rounded hover:bg-slate-100'
                          title='نسخ الكود'
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    <div className='w-full flex flex-col sm:flex-row gap-3 mt-2'>
                      <Button
                        onClick={handlePrintCard}
                        variant='default'
                        className='flex-1 gap-2 bg-slate-900 hover:bg-slate-800 text-white'
                      >
                        <Printer size={18} />
                        طباعة الكارنيه
                      </Button>
                      <Button
                        variant='secondary'
                        onClick={() => setSuccessData(null)}
                        className='flex-1 gap-2'
                      >
                        <PlusCircle size={18} />
                        إضافة طالب آخر
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='w-full bg-amber-50 p-6 rounded-xl border border-amber-200 flex flex-col items-center gap-2 text-center'>
                      <Lock className='h-8 w-8 text-amber-500 mb-1' />
                      <h3 className='font-bold text-amber-800'>طباعة الكارنيه غير متاحة</h3>
                      <p className='text-sm text-amber-700'>
                        ميزة الباركود وطباعة الكارنيهات متاحة فقط في الباقات الأعلى. تم حفظ الطالب
                        بنجاح في سجلاتك.
                      </p>
                      <div className='flex items-center gap-2 bg-white px-3 py-1 mt-2 rounded border border-amber-200 text-sm font-mono text-slate-700'>
                        كود الطالب: {successData.code}
                        <button
                          onClick={copyCode}
                          className='hover:text-primary transition-colors'
                          title='نسخ'
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>

                    <div className='w-full flex justify-center mt-2'>
                      <Button
                        variant='default'
                        onClick={() => setSuccessData(null)}
                        className='w-full gap-2'
                      >
                        <PlusCircle size={18} />
                        إضافة طالب آخر
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
