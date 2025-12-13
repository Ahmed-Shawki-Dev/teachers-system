// layout.tsx
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '../../../components/app-sidebar'
import Navbar from '../../../components/header/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className='flex flex-col w-full min-h-screen'>
        <Navbar showSidebarTrigger />
        <div className='flex-1 p-4 md:p-6'>{children}</div>
      </main>
    </SidebarProvider>
  )
}
