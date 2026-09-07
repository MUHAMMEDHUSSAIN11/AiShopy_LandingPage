import type { MetadataRoute } from 'next'
import { AISHOPY_SITE_ORIGIN } from '@/lib/og-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: AISHOPY_SITE_ORIGIN,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${AISHOPY_SITE_ORIGIN}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${AISHOPY_SITE_ORIGIN}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]
}
