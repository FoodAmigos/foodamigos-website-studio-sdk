import type { HttpClient } from "../../core/client"
import type { Website } from "./types"

export class WebsiteModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  get(): Promise<Website> {
    return this.client.fetch<Website>(`/api/websites/${this.websiteUuid}`)
  }
}
