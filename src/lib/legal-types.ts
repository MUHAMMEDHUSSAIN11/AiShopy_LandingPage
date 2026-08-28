export type LegalSubsection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export type LegalSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  subsections?: LegalSubsection[]
}

export type LegalDocumentContent = {
  title: string
  subtitle?: string
  lastUpdated: string
  summary?: string
  sections: LegalSection[]
}
