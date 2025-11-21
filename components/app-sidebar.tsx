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
    url: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar side='right' >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>لوحة التحكم</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
