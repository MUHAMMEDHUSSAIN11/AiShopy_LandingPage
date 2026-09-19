import Script from 'next/script'
import MetaLeadTracker from '@/components/MetaLeadTracker'

/**
 * Meta Pixel for paid ads measurement on the marketing site.
 * Set NEXT_PUBLIC_META_PIXEL_ID in Vercel / .env.local (Events Manager → Pixel).
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()
  if (!pixelId) return null

  const id = JSON.stringify(pixelId)

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${id});
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <MetaLeadTracker />
    </>
  )
}
