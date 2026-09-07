import type { MetadataRoute } from 'next'
import { AISHOPY_SITE_ORIGIN } from '@/lib/og-metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/preview/'],
    },
    sitemap: `${AISHOPY_SITE_ORIGIN}/sitemap.xml`,
  }
}
