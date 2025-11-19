'use client'
import { LayoutDashboardIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTeacherStore } from '../../store/useAuthStore'

const getListItems = (userId: string | null) => [
  {
    icon: UserIcon,
    property: 'الملف الشخصي',
    link: userId ? `/profile/${userId}` : '/login',
  },
  {
    icon: LayoutDashboardIcon,
    property: 'لوحة التحكم',
    link: '/dashboard',
  },
  {
    icon: SettingsIcon,
    property: 'الإعدادات',
    link: '/settings',
  },
  {
    icon: LogOutIcon,
    property: 'تسجيل الخروج',
    link: '/logout',
  },
]

const UserMenu = () => {
  const { teacher } = useTeacherStore()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu dir='rtl' open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='overflow-hidden rounded-full'>
          <Image
            src={teacher?.avatarUrl || '/avatar.webp'}
            alt={teacher?.name || 'اسم المستر'}
            width={200}
            height={200}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{teacher?.name}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {getListItems(teacher?.id || null).map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => setOpen(false)}>
              <Link href={item.link} className='flex gap-2 items-center w-full'>
                <item.icon className='mr-2 h-4 w-4' />
                <span>{item.property}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
