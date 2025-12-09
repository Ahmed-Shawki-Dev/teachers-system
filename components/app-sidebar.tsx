'use client'
import {
  Calendar,
  Clock10,
  Home,
  LifeBuoy,
  Newspaper,
  PersonStandingIcon,
  Settings,
} from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter, // استيراد الفوتر
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// القائمة الأساسية
const items = [
  { title: 'الصفحة الرئيسية', url: '/dashboard', icon: Home },
  { title: 'الحصص', url: '/dashboard/sessions', icon: Calendar },
  { title: 'المجاميع', url: '/dashboard/groups', icon: Clock10 },
  { title: 'الطلاب', url: '/dashboard/students', icon: PersonStandingIcon },
  { title: 'الإمتحانات', url: '/dashboard/exams', icon: Newspaper },
  { title: 'الإعدادات', url: '/dashboard/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <Sidebar side='right'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>لوحة التحكم</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={
                    isActive(item.url)
                      ? 'bg-sidebar-ring/10 rounded-md text-primary'
                      : 'text-muted-foreground'
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className='font-medium'>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='p-4'>
        <div className='bg-muted/50 rounded-lg p-4 border border-dashed text-center space-y-3'>
          <div className='relative w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-primary/20'>
            <Image src='/ahmedshawki.webp' alt='Ahmed Shawki' fill className='object-cover' />
          </div>
          <div>
            <h4 className='font-bold text-sm'>واجهت مشكلة؟</h4>
            <p className='text-xs text-muted-foreground'>تواصل مع المطور مباشرة</p>
          </div>
          <Button size='sm' className='w-full gap-2' asChild variant={'default'}>
            <Link href='https://wa.me/+201098786468' target='_blank'>
              <LifeBuoy className='w-4 h-4' />
              الدعم الفني
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
