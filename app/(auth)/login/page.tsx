import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden'>
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

      {/* زرار العودة */}
      <div className='absolute top-4 right-4 sm:top-8 sm:right-8 z-10'>
        <Button
          variant='ghost'
          asChild
          className='gap-2 backdrop-blur-sm bg-background/50 hover:bg-background/80 border border-primary/20'
        >
          <Link href='/'>
            <ArrowRight className='w-4 h-4' />
            العودة للرئيسية
          </Link>
        </Button>
      </div>

      {/* الفورم */}
      <LoginForm />
    </div>
  )
}
