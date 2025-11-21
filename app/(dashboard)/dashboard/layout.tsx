import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '../../../components/app-sidebar'
import Navbar from '../../../components/header/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex flex-col w-full'>
        <Navbar />
        <SidebarTrigger className='absolute bottom-5 bg-accent rounded-full p-5 right-5 z-50' />
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </SidebarProvider>
  )
}
