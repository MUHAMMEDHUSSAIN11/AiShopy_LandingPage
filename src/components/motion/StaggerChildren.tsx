'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, staggerItem, viewport } from '@/lib/motion'

type StaggerChildrenProps = {
  children: React.ReactNode
  className?: string
  stagger?: number
}

export function StaggerChildren({ children, className, stagger }: StaggerChildrenProps) {
  const reduceMotion = useReducedMotion()
  const mergedClassName = ['w-full min-w-0', className].filter(Boolean).join(' ')

  if (reduceMotion) {
    return <div className={mergedClassName}>{children}</div>
  }

  return (
    <motion.div
      className={mergedClassName}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        ...staggerContainer,
        visible: {
          transition: {
            staggerChildren: stagger ?? 0.1,
            delayChildren: 0.06,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion()
  const mergedClassName = ['w-full min-w-0', className].filter(Boolean).join(' ')

  if (reduceMotion) {
    return <div className={mergedClassName}>{children}</div>
  }

  return (
    <motion.div className={mergedClassName} variants={staggerItem}>
      {children}
    </motion.div>
  )
}
