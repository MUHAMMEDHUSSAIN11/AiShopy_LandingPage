import type { LegalDocumentContent } from '@/lib/legal-types'

type Props = {
  content: LegalDocumentContent
}

function BlockList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
      {items.map((item) => (
        <li key={item} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((paragraph) => (
        <p key={paragraph} className="mt-3 leading-relaxed text-gray-600">
          {paragraph}
        </p>
      ))}
    </>
  )
}

export default function LegalDocument({ content }: Props) {
  return (
    <article>
      <header className="mb-10 border-b border-gray-100 pb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-brand-green">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {content.title}
        </h1>
        {content.subtitle ? (
          <p className="mt-2 text-lg text-gray-500">{content.subtitle}</p>
        ) : null}
        <p className="mt-4 text-sm text-gray-400">Last updated: {content.lastUpdated}</p>
        {content.summary ? (
          <p className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm leading-relaxed text-gray-700">
            {content.summary}
          </p>
        ) : null}
      </header>

      <div className="space-y-10">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
            {section.paragraphs ? <Paragraphs items={section.paragraphs} /> : null}
            {section.bullets ? <BlockList items={section.bullets} /> : null}
            {section.subsections?.map((subsection) => (
              <div key={subsection.title} className="mt-6">
                <h3 className="text-base font-semibold text-gray-800">{subsection.title}</h3>
                {subsection.paragraphs ? <Paragraphs items={subsection.paragraphs} /> : null}
                {subsection.bullets ? <BlockList items={subsection.bullets} /> : null}
              </div>
            ))}
          </section>
        ))}
      </div>
    </article>
  )
}
