'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTeacherByTokenAction } from '../../actions/Teacher/getTeacherByToken'
import { useTeacherStore } from '../../store/useAuthStore'
import { ModeToggle } from '../toggle-theme'
import { Button } from '../ui/button'
import UserMenu from './UserMenu'
import Image from 'next/image'

const Navbar = ({className}:{className?:string}) => {
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

      <div className='relative flex justify-between items-center p-4 container mx-auto'>
        {/* Logo */}
        <div
          className='font-bold cursor-pointer select-none hover:scale-105 transition-transform duration-200'
          onClick={() => router.push('/')}
        >
<Image
  src="/logo.png"
  alt="logo"
  width={90}
  height={90}
  style={{ width: '90px', height: 'auto' }}
/>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-4'>
          <ModeToggle />
          {loading ? (
            <Skeleton className='h-10 w-10 rounded-full' />
          ) : teacher?.id ? (
            <UserMenu />
          ) : (
            <Button
              size={'icon'}
              onClick={() => router.push('/login')}
              className='bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-md shadow-primary/20'
            >
              <LogIn />
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
