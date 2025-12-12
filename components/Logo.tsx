'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Logo = () => {
  const router = useRouter()
  return (
    <div className='font-bold cursor-pointer select-none ' onClick={() => router.push('/')}>
      <Image
        src='/logo-final.svg'
        className='dark:hidden block'
        alt='logo'
        width={100}
        height={100}
        style={{ width: '100px', height: 'auto' }}
      />
      <Image
        src='/logo-dark-final.svg'
        className='dark:block hidden'
        alt='logo'
        width={100}
        height={100}
        style={{ width: '100px', height: 'auto' }}
      />
    </div>
  )
}

export default Logo
