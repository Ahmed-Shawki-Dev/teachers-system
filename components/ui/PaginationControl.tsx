'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

export default function PaginationControl({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    // 1. ناخد نسخة من الباراميترز الحالية (عشان نحافظ على query و groupId)
    const params = new URLSearchParams(searchParams.toString())

    // 2. نعدل رقم الصفحة بس
    params.set('page', newPage.toString())

    // 3. نوديه للرابط الجديد مع الحفاظ على القديم
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex items-center justify-end gap-2 py-4 mt-4 border-t'>
      <div className='text-sm text-muted-foreground ml-4'>
        صفحة <span className='font-bold text-foreground'>{currentPage}</span> من {totalPages}
      </div>

      <Button
        variant='outline'
        size='sm'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className='gap-1'
      >
        <ChevronRight className='h-4 w-4' />
        السابق
      </Button>

      <Button
        variant='outline'
        size='sm'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className='gap-1'
      >
        التالي
        <ChevronLeft className='h-4 w-4' />
      </Button>
    </div>
  )
}
