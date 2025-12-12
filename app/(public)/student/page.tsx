'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Logo from '@/components/Logo' // تأكد من المسار

export default function StudentSearchPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length < 6) {
      toast.error('يرجى إدخال كود صحيح (6 أرقام)')
      return
    }

    setLoading(true)
    // توجيه لصفحة الطالب
    router.push(`/student/${code}`)
  }

  return (
    <div className='h-[80vh] flex flex-col items-center justify-center bg-muted/20 p-4 '>
      <div className='w-full max-w-md bg-background rounded-2xl border shadow-xl p-8 space-y-8 text-center'>
        {/* اللوجو */}
        <div className='flex justify-center mb-6'>
          <Logo />
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>بوابة ولي الأمر</h1>
          <p className='text-muted-foreground text-sm'>
            أدخل كود الطالب لمتابعة المستوى الدراسي والغياب
          </p>
        </div>

        <form onSubmit={handleSearch} className='space-y-4'>
          <div className='relative'>
            <Input
              placeholder='كود الطالب'
              className='text-center text-lg tracking-widest h-12 '
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={8}
            />
          </div>

          <Button type='submit' className='w-full h-12 text-lg' disabled={loading}>
            {loading ? (
              'جاري البحث...'
            ) : (
              <span className='flex items-center gap-2'>
                بحث <Search className='w-5 h-5' />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
