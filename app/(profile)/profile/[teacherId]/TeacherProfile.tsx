'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { User } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTeacherStore } from '../../../../store/useAuthStore'

export default function TeacherProfile({ teacherId }: { teacherId: string }) {
  const router = useRouter()
  const { teacher } = useTeacherStore()

  if (!teacher) {
    return (
      <Card className='w-full max-w-sm overflow-hidden border-0 shadow-xl'>
        <div className='relative h-40 bg-linear-to-br from-primary/20 via-primary/10 to-background'>
          <div className='absolute -bottom-16 left-1/2 -translate-x-1/2'>
            <div className='ring-8 ring-background rounded-full bg-card shadow-2xl'>
              <Skeleton className='w-32 h-32 rounded-full' />
            </div>
          </div>
        </div>

        <CardHeader className='pt-20 text-center'>
          <Skeleton className='h-8 w-40 mx-auto' />
          <Skeleton className='h-4 w-32 mx-auto mt-3' />
        </CardHeader>

        <CardContent className='text-center pb-10'>
          <Skeleton className='h-4 w-48 mx-auto' />
        </CardContent>
      </Card>
    )
  }

  if (teacher.id !== teacherId) {
    router.replace('/')
    return null
  }

  const { name, avatarUrl, bio, phone } = teacher

  return (
    <Card className='w-full max-w-sm overflow-hidden border-0 shadow-xl'>
      <div className='relative h-40 bg-linear-to-br from-primary/20 via-primary/10 to-background'>
        <div className='absolute -bottom-16 left-1/2 -translate-x-1/2'>
          <div className='ring-8 ring-background rounded-full bg-card shadow-2xl'>
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name || 'المدرس'}
                width={128}
                height={128}
                className='rounded-full object-cover w-32 h-32 border-4 border-card'
                priority
              />
            ) : (
              <div className='flex items-center justify-center w-32 h-32 rounded-full bg-muted'>
                <User className='h-16 w-16 text-muted-foreground' />
              </div>
            )}
          </div>
        </div>
      </div>

      <CardHeader className='pt-20 text-center'>
        <CardTitle className='text-3xl font-bold'>{name || 'أستاذنا العزيز'}</CardTitle>
      </CardHeader>

      <CardContent className='text-center pb-10'>
        <p className='text-lg text-muted-foreground mt-2'>{bio}</p>
        <p className='text-lg text-muted-foreground mt-2'>{phone}</p>
      </CardContent>
    </Card>
  )
}
