'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ModeToggle } from '../toggle-theme'
import { Button } from '../ui/button'
import UserMenu from './UserMenu'

const Navbar = () => {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me')
        const data = await res.json()
        setUserId(data.auth ? data.id : null)
      } catch {
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <nav className='w-full flex justify-between items-center p-4 border-b bg-background'>
      <div className='font-bold cursor-pointer select-none' onClick={() => router.push('/')}>
        لوجو
      </div>

      <div className='flex items-center gap-4'>
        <ModeToggle />
        {loading ? (
          <Skeleton className='h-10 w-10 rounded-full' />
        ) : userId ? (
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
