'use client'
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'

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
import { useEffect, useState } from 'react'

const getListItems = (userId: string | null) => [
  {
    icon: UserIcon,
    property: 'الملف الشخصي',
    link: userId ? `/teacher-profile/${userId}` : '/login',
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
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [open,setOpen] = useState(false)
  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.auth) {
          setUserId(data.id)
          setAvatarUrl(data.avatarUrl)
          setName(data.name)
        }
      })
      .catch(() => setUserId(null))
  }, [])

  return (
    <DropdownMenu dir='rtl' open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='overflow-hidden rounded-full'>
          <Image
            src={avatarUrl ? avatarUrl : '/avatar.webp'}
            alt={name?name:"اسم المستر"}
            width={200}
            height={200}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {getListItems(userId).map((item, index) => (
            <DropdownMenuItem key={index} onClick={()=>setOpen(false)}>
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
