'use client'
import { Clock10, Home, PersonStandingIcon, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Menu items.
const items = [
  {
    title: 'الصفحة الرئيسية',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'الطلاب',
    url: '/dashboard/students',
    icon: PersonStandingIcon,
  },
  {
    title: 'المجاميع',
    url: '/dashboard/groups',
    icon: Clock10,
  },
  {
    title: 'الإعدادات',
    url: '/dashboard/settings',
    icon: Settings,
  },
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
                    isActive(item.url) ? 'bg-sidebar-ring rounded-md ' : 'text-muted-foreground'
                  }
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
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
    </Sidebar>
  )
}
