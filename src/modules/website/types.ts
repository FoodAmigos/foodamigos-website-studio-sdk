export type Website = {
  uuid: string
  name: string
  domain: string
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

export type PageConfig = {
  slug: string
  path: string
  label: string
  navLabel: string
  isNavItem: boolean
  isLegalPage: boolean
  seo: {
    title: string
    description: string
    robots: string
    keywords?: string[]
  }
}

export type PageMetadataResult = {
  title: string
  description: string
  robots: string
  keywords: string[]
  metadataBase: URL
  alternates: { canonical: string }
  openGraph: {
    type: 'website'
    title: string
    description: string
    siteName: string
  }
  twitter: {
    title: string
    description: string
  }
}
