'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { LogIn, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTeacherByTokenAction } from '../../actions/Teacher/getTeacherByToken'
import { useTeacherStore } from '../../store/useAuthStore'
import Logo from '../Logo'
import { ModeToggle } from '../toggle-theme'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'
import UserMenu from './UserMenu'

const Navbar = ({
  className,
  showSidebarTrigger = false,
}: {
  className?: string
  showSidebarTrigger?: boolean
}) => {
  const router = useRouter()
  const { teacher, setTeacher } = useTeacherStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkTeacher = async () => {
      // نفس اللوجيك بتاعك بالظبط لجلب البيانات
      if (!teacher) {
        try {
          const data = await getTeacherByTokenAction()
          if (data) {
            setTeacher({
              ...data,
              bio: data.bio ?? undefined,
              phone: data.phone ?? undefined,
              avatarUrl: data.avatarUrl ?? undefined,
            })
          } else {
            setTeacher(null)
          }
        } catch {
          setTeacher(null)
        }
      }
      setLoading(false)
    }

    checkTeacher()
  }, [teacher, setTeacher])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md ${className}`}
    >
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* 1. المنطقة اليمنى: التريجر (بشرط) + اللوجو */}
        <div className='flex items-center gap-2'>
          {/* 🛑 التعديل الأهم: الزرار والفاصل يظهروا بس لو المدرس موجود (يعني جوا الداشبورد) */}
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className='h-9 w-9' />
              <Separator orientation='vertical' className='h-6 mx-1 hidden sm:block' />
            </>
          )}

          {/* اللوجو يظهر دايماً */}
          <div className='flex items-center gap-2'>
            <Logo />
          </div>
        </div>

        {/* 2. المنطقة اليسرى */}
        <div className='flex items-center gap-3'>
          <ModeToggle />

          {loading ? (
            <Skeleton className='h-9 w-9 rounded-full' />
          ) : teacher?.id ? (
            <UserMenu />
          ) : (
            <>
              <Button
                variant='ghost'
                onClick={() => router.push('/student')}
                className='hidden sm:flex font-bold'
              >
                <Search className='w-4 h-4 ml-2' />
                تتبع الطالب
              </Button>

              <Button
                variant='ghost'
                size='icon'
                onClick={() => router.push('/student')}
                className='sm:hidden'
              >
                <Search className='w-5 h-5' />
              </Button>

              <Button
                onClick={() => router.push('/login')}
                className='dark:text-background dark:bg-foreground'
              >
                <LogIn className='w-4 h-4 ml-2' />
                <span>دخول</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
