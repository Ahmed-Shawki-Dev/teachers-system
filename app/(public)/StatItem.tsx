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
    <div className='p-6  rounded-2xl border shadow-sm hover:shadow-md transition-shadow group h-full flex flex-col items-center justify-center'>
      <div
        className={`w-12 h-12 mb-4 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${color}`}
      >
        <Icon className='w-6 h-6' />
      </div>

      {/* 🛑 التعديل هنا: items-center + flex-row-reverse عشان نضمن ظهور الرقم جنب العلامة صح */}
      <div className='text-4xl font-black mb-1 flex justify-center items-center gap-1 flex-row-reverse'>
        {/* 1. الرقم (حطيناه في span عشان نضمن له layout) */}
        <span>
          <CountUp to={value} />
        </span>

        {/* 2. العلامة (%) */}
        <span className='text-2xl text-muted-foreground/80 self-end mb-1'>{suffix}</span>
      </div>

      <p className='text-muted-foreground font-medium text-center'>{label}</p>
    </div>
  )
}
