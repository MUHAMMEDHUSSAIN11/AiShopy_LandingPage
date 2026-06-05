'use client'

import FadeIn from '@/components/motion/FadeIn'

type SectionHeadingProps = {
  title: string
  subtitle?: string
  className?: string
  dark?: boolean
}

export default function SectionHeading({ title, subtitle, className = '', dark = false }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <FadeIn direction="up">
        <h2
          className={`text-3xl font-bold tracking-tight md:text-4xl ${
            dark ? 'text-white' : 'text-brand-dark'
          }`}
        >
          {title}
        </h2>
      </FadeIn>
      {subtitle && (
        <FadeIn direction="up" delay={0.1}>
          <p
            className={`mx-auto mt-4 max-w-2xl text-lg ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  )
}
