import { type LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  desc: string
  gradient: string
}

export default function FeatureCard({ icon: Icon, title, desc, gradient }: FeatureCardProps) {
  return (
    <div className='group relative p-0.5 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300'>
      {/* Border Gradient on Hover */}
      <div className='absolute inset-0 bg-linear-to-br from-border to-transparent group-hover:from-primary/50 group-hover:to-purple-500/50 transition-all duration-500 opacity-50 group-hover:opacity-100' />

      <div className='relative h-full bg-card/80 backdrop-blur-sm p-8 rounded-[14px]'>
        <div
          className={`w-14 h-14 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
        >
          <Icon className='w-7 h-7' />
        </div>
        <h3 className='text-xl font-bold mb-3 group-hover:text-primary transition-colors'>
          {title}
        </h3>
        <p className='text-muted-foreground leading-relaxed text-sm'>{desc}</p>
      </div>
    </div>
  )
}
