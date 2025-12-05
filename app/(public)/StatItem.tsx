import { type LucideIcon } from 'lucide-react'
import CountUp from '../../animation/CountUp'

interface StatItemProps {
  value: number
  label: string
  suffix?: string
  icon: LucideIcon
  color: string
}

export default function StatItem({ value, label, suffix = '+', icon: Icon, color }: StatItemProps) {
  return (
    <div className='p-6 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow group'>
      <div
        className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${color}`}
      >
        <Icon className='w-6 h-6' />
      </div>
      <div className='text-4xl font-black mb-1 flex justify-center items-baseline gap-1'>
        <span>{suffix}</span>
        <CountUp to={value} />
      </div>
      <p className='text-muted-foreground font-medium text-center'>{label}</p>
    </div>
  )
}
