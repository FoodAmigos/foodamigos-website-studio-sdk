import type { HttpClient } from "../../core/client"
import type { Website, PageConfig, PageMetadataResult } from "./types"

export class WebsiteModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  get(): Promise<Website> {
    return this.client.fetchData<Website>(`/api/websites/${this.websiteUuid}`)
  }

  async generatePageMetadata(input: PageConfig | undefined): Promise<PageMetadataResult> {
    const website = await this.get().catch(() => null)
    const siteName = website?.name ?? ''
    const domain = website?.domain ?? 'localhost'
    const title = input?.seo?.title ?? ''
    const description = input?.seo?.description ?? ''
    const robots = input?.seo?.robots ?? 'index, follow'
    const keywords = input?.seo?.keywords ?? []
    const canonical = `https://${domain}${input?.path ?? '/'}`

    return {
      title,
      description,
      robots,
      keywords,
      metadataBase: new URL(`https://${domain}`),
      alternates: { canonical },
      openGraph: {
        type: 'website',
        title,
        description,
        siteName,
      },
      twitter: {
        title,
        description,
      },
    }
  }
}
