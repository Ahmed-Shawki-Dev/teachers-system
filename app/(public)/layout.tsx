import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/header/Header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <Navbar className='absolute inset-0 bg-linear-to-b from-accent dark:brightness-115 via-background to-accent ' />
        {children}
        <Footer className='absolute inset-0 bg-accent/50 ' />
      </main>
    </>
  )
}
