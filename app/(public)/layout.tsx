import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/header/Header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </>
  )
}
