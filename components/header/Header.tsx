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
import UserMenu from './UserMenu'

const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter()
  const { teacher, setTeacher } = useTeacherStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkTeacher = async () => {
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
    <nav className='top-0 z-50 w-full  '>
      {/* Subtle gradient overlay */}
      <div className={className} />

      <div className='relative flex justify-between  items-center p-4  container mx-auto'>
        {/* Logo */}
        <Logo />
        {/* Actions */}
        <div className='flex items-center gap-4'>
          <ModeToggle />
          {loading ? (
            <Skeleton className='h-10 w-10 rounded-full' />
          ) : teacher?.id ? (
            <UserMenu />
          ) : (
            <>
              <Button variant={'outline'} onClick={() => router.push('/student')}>
                <Search />
                <span className='hidden md:inline'> تتبع الطالب</span>
              </Button>
              <Button
                onClick={() => router.push('/login')}
                className='light:bg-linear-to-r light:from-primary light:to-accent/50 hover:opacity-90 dark:bg-foreground transition-opacity shadow-md shadow-primary/20'
              >
                <LogIn className='dark:text-background' />
                <span className='hidden md:inline dark:text-background'> دخول</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
