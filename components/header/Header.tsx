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

const Navbar = () => {
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
    <nav className=' w-full flex justify-between items-center p-4 border-b bg-background '>
      <div className='font-bold cursor-pointer select-none' onClick={() => router.push('/')}>
        <Image src={'/logo.png'} alt='logo' width={80} height={80}  />
      </div>

      <div className='flex items-center gap-4'>
        <ModeToggle />
        {loading ? (
          <Skeleton className='h-10 w-10 rounded-full' />
        ) : teacher?.id ? (
          <UserMenu />
        ) : (
          <Button size={'icon'} onClick={() => router.push('/login')}>
            <LogIn />
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
