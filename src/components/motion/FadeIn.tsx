'use client'

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

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  const transition = {
    ...defaultTransition,
    ...(duration !== undefined ? { duration } : {}),
    delay,
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      {...(view
        ? { whileInView: 'visible', viewport }
        : { animate: 'visible' })}
      variants={variantMap[direction]}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
