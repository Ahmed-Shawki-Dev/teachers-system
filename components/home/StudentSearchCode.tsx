'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function StudentSearchCode() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 6) {
      toast.error('الكود يجب أن يكون 6 أرقام على الأقل')
      return
    }

    setLoading(true)
    // توجيه المستخدم لصفحة البروفايل مباشرة
    router.push(`/student/${code}`)
  }

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/20 flex rounded-[2.5rem]   flex-col items-center text-center'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4'>
              <Sparkles className='ml-2 h-4 w-4' />
              لأولياء الأمور والطلاب
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
              تابع مستوى ابنك الدراسي لحظة بلحظة
            </h2>
            <p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto'>
              أدخل كود الطالب الخاص بك للاطلاع على درجات الامتحانات، سجل الحضور، والمدفوعات فوراً
              بدون تسجيل دخول.
            </p>
          </div>

          <div className='w-full max-w-sm space-y-2  pt-4'>
            <form onSubmit={handleSearch} className='flex gap-1 space-x-reverse'>
              <Input
                className='flex-1 bg-background h-12 text-lg text-center tracking-widest  '
                placeholder='أدخل كود الطالب'
                type='text'
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button type='submit' size='lg' className='h-12 px-8' disabled={loading}>
                {loading ? (
                  <span className='animate-pulse'>جاري...</span>
                ) : (
                  <Search className='h-5 w-5' />
                )}
              </Button>
            </form>
            <p className='text-xs text-muted-foreground pt-2'>
              * احصل على الكود من المدرس الخاص بالطالب
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
