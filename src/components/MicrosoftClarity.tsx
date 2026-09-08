import Script from 'next/script'

/**
 * Microsoft Clarity session analytics for the marketing site.
 * Set NEXT_PUBLIC_CLARITY_PROJECT_ID in Vercel / .env.local (from clarity.microsoft.com).
 */
export default function MicrosoftClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim()
  if (!projectId) return null

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId)});`}
    </Script>
  )
}
