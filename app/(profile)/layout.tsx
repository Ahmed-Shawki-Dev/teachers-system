import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/header/Header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className='h-screen flex flex-col justify-between'>
        <Navbar />
        <div className='absolute inset-0 bg-linear-to-b from-accent/20 via-background to-background'>
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent animate-pulse' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent animate-pulse [animation-delay:1s]' />
        </div>
        {children}
        <div>
          <Footer />
        </div>
      </main>
    </>
  )
}
