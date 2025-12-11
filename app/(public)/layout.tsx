import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/header/Header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    // تنسيق يضمن ان الفوتر دايما تحت والمحتوى واخد راحته
    <main className='flex flex-col min-h-screen relative '>
      <Navbar />
      <div className='flex-1 font-serif'>{children}</div>
      <Footer />
    </main>
  )
}
