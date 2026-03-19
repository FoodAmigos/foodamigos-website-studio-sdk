import type { HttpClient } from "../../core/client"
import type { Company } from "./types"

export class CompaniesModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  list(): Promise<Company[]> {
    return this.client.fetch<Company[]>(
      `/api/websites/${this.websiteUuid}/companies`
    )
  }
}
