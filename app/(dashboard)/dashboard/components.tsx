// app/(dashboard)/dashboard/components.tsx
// 👑 ده ملف Components عادي (Server Component by default)
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

// 1. StatCard
interface StatCardProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
  highlight?: boolean
}

export function StatCard({ title, value, description, icon: Icon, highlight }: StatCardProps) {
  return (
    <Card
      className={`shadow-sm transition-all hover:shadow-md ${
        highlight ? 'border-primary/50 bg-primary/5' : ''
      }`}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}>{value}</div>
        <p className='text-xs text-muted-foreground mt-1'>{description}</p>
      </CardContent>
    </Card>
  )
}

// 2. QuickActionButton
interface QuickActionProps {
  href: string
  label: string
  icon: LucideIcon
}

export function QuickActionButton({ href, label, icon: Icon }: QuickActionProps) {
  return (
    <Button
      variant='outline'
      asChild
      className='w-full justify-start h-12 text-base shadow-sm hover:border-primary/50 hover:bg-background'
    >
      <Link href={href}>
        <div className='bg-primary/10 p-1.5 rounded-full ml-3'>
          <Icon className='w-4 h-4 text-primary' />
        </div>
        {label}
      </Link>
    </Button>
  )
}

// 🛑 OverviewChart هو Client Component، خليه في ملفه الأصلي.
