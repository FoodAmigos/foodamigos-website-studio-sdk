import type { HttpClient } from "../../core/client"
import type { PageSeo, Seo } from "./types"

export class SeoModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  get(): Promise<Seo> {
    return this.client.fetch<Seo>(
      `/api/websites/${this.websiteUuid}/seo`
    )
  }

  getPageSeo(slug: string): Promise<PageSeo> {
    return this.client.fetch<PageSeo>(
      `/api/websites/${this.websiteUuid}/pages/${slug}/seo`
    )
  }
}
