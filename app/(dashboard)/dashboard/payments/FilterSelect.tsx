'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterSelectProps {
  paramKey: string
  options: { value: string; label: string }[]
  defaultValue: string
  placeholder?: string
}

export default function FilterSelect({
  paramKey,
  options,
  defaultValue,
  placeholder,
}: FilterSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramKey, val)
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={defaultValue} onValueChange={handleChange}>
      <SelectTrigger className='w-[180px] bg-background border-input'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
