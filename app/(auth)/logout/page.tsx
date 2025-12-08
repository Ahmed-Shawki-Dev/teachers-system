'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, ArrowRight } from 'lucide-react'
import LogoutButton from '../../../components/header/LogoutButton'

const LogoutPage = () => {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden px-4'>
      {/* Animated Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/20'>
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent animate-pulse' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent animate-pulse [animation-delay:1s]' />
      </div>

      {/* Mesh Pattern Overlay */}
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glass Card */}
      <div className='relative z-10 w-full max-w-md'>
        <div className='relative backdrop-blur-xl bg-background/80 p-8 rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10'>
          {/* Gradient Border Effect */}
          <div className='absolute inset-0 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 opacity-50 blur-xl -z-10' />

          {/* Header */}
          <div className='space-y-4 text-center mb-8'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-accent/20'>
              <LogOut className='h-8 w-8 text-primary' />
            </div>
            <h2 className='text-2xl font-bold bg-linear-to-br from-primary to-accent bg-clip-text text-transparent'>
              تسجيل الخروج
            </h2>
            <p className='text-base text-muted-foreground'>
              هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
            </p>
          </div>

          {/* Buttons */}
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='font-medium backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-background/80'
            >
              <Link href='/'>
                <ArrowRight className='ml-2 h-4 w-4' />
                لا، ارجع
              </Link>
            </Button>

            <LogoutButton />
          </div>

          {/* Footer */}
          <div className='text-center'>
            <p className='text-sm text-muted-foreground'>
              ستحتاج لتسجيل الدخول مرة أخرى عند العودة
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LogoutPage
