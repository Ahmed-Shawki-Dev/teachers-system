import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react' // استوردنا الأيقونات
import Link from 'next/link'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className='relative min-h-screen flex items-center justify-center bg-muted/20 p-4'>
      <div className='absolute top-4 right-4 sm:top-8 sm:right-8'>
        <Button variant='ghost' asChild className='gap-2'>
          <Link href='/'>
            <ArrowRight className='w-4 h-4' /> 
            العودة للرئيسية
          </Link>
        </Button>
      </div>


      <div className='w-full max-w-md space-y-8'>
        <LoginForm />
      </div>
    </div>
  )
}
