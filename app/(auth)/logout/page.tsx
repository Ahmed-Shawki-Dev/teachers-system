'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LogOut, ArrowRight } from 'lucide-react'
import LogoutButton from '../../../components/header/LogoutButton'

const LogoutPage = () => {
  return (
    <section className='min-h-screen flex items-center justify-center bg-background px-4'>
      <Card className='w-full max-w-md border shadow-lg'>
        <CardHeader className='space-y-4 text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
            <LogOut className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-2xl font-bold'>تسجيل الخروج</CardTitle>
          <CardDescription className='text-base'>
            هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
          </CardDescription>
        </CardHeader>

        <CardContent className='pt-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Button asChild variant='outline' size='lg' className='font-medium'>
              <Link href='/'>
                <ArrowRight className='ml-2 h-4 w-4' />
                لا، ارجع
              </Link>
            </Button>

            <LogoutButton />
          </div>
        </CardContent>

        <CardFooter className='flex justify-center pb-6'>
          <p className='text-sm text-muted-foreground'>ستحتاج لتسجيل الدخول مرة أخرى عند العودة</p>
        </CardFooter>
      </Card>
    </section>
  )
}

export default LogoutPage
