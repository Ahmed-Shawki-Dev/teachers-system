'use client'

import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function CountUp({
  to,
  from = 0,
  className = '',
}: {
  to: number
  from?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  const motionValue = useMotionValue(from)

  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })

  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(to)
    }
  }, [isInView, to, motionValue])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.round(latest))
      }
    })
  }, [springValue])

  return <span className={className} ref={ref} />
}
