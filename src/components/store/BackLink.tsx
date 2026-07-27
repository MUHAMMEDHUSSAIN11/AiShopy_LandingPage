import Link from 'next/link'

type BackLinkProps = {
  href: string
  label: string
  className?: string
}

export default function BackLink({ href, label, className = '' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-store-primary ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-store-bg shadow-sm transition group-hover:border-store-primary group-hover:text-store-primary">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span>{label}</span>
    </Link>
  )
}
