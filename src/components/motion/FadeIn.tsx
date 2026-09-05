'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  defaultTransition,
  fadeDown,
  fadeLeft,
  fadeRight,
  fadeUp,
  scaleIn,
  viewport,
} from '@/lib/motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale'

const variantMap = {
  up: fadeUp,
  down: fadeDown,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
} as const

type FadeInProps = {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  view?: boolean
}

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration,
  view = true,
  className,
}: FadeInProps) {
  const reduceMotion = useReducedMotion()
  // Default false so mobile never briefly applies left/right slide (looks off-center).
  const [isMdUp, setIsMdUp] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsMdUp(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const resolvedDirection =
    !isMdUp && (direction === 'left' || direction === 'right') ? 'up' : direction

  const mergedClassName = ['w-full min-w-0', className].filter(Boolean).join(' ')

  if (reduceMotion) {
    return <div className={mergedClassName}>{children}</div>
  }

  const transition = {
    ...defaultTransition,
    ...(duration !== undefined ? { duration } : {}),
    delay,
  }

  return (
    <motion.div
      className={mergedClassName}
      initial="hidden"
      {...(view
        ? { whileInView: 'visible', viewport }
        : { animate: 'visible' })}
      variants={variantMap[resolvedDirection]}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
