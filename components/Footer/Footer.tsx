import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer className=' relative   py-6 mt-auto'>
      <div className={className} />

      <div className='container relative z-50 flex flex-col md:flex-row items-center justify-between mx-auto gap-4 px-4 text-sm text-muted-foreground'>
        {/* 1. الحقوق */}
        <p>
          <span>جميع الحقوق محفوظة </span>
          <span className='font-semibold'>الدفتر.</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </p>

        <div className='flex items-center gap-1'>
          <span>صُنع بكل</span>
          <span>❤️</span>
          <span>بواسطة</span>
          <Link
            href='https://ahmedshawkidev.vercel.app/'
            target='_blank'
            className='font-bold text-primary hover:underline underline-offset-4'
          >
            Ahmed Shawki
          </Link>
        </div>

        {/* 3. زرار الدعم السريع */}
        <Link
          href='https://wa.me/+201098786468'
          target='_blank'
          className='flex items-center gap-2 hover:text-green-600 transition-colors font-medium'
        >
          <MessageCircle className='h-4 w-4' />
          الدعم الفني
        </Link>
      </div>
    </footer>
  )
}

export default Footer
