import { type LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  desc: string
  gradient: string
  delay?: number
}

export default function FeatureCard({ icon: Icon, title, desc, gradient }: FeatureCardProps) {
  return (
    <div className='group relative p-1 rounded-2xl bg-linear-to-b from-border to-transparent hover:from-primary/20 transition-colors duration-500'>
      <div className='relative h-full bg-card p-8 rounded-xl border shadow-sm group-hover:shadow-md transition-all'>
        <div
          className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className='w-7 h-7' />
        </div>
        <h3 className='text-xl font-bold mb-3'>{title}</h3>
        <p className='text-muted-foreground leading-relaxed'>{desc}</p>
      </div>
    </div>
  )
}
