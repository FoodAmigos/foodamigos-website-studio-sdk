import type { HttpClient } from "../../core/client"
import type { GoogleReview } from "./types"

export class GoogleReviewsModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  list(): Promise<GoogleReview[]> {
    return this.client.fetch<GoogleReview[]>(
      `/api/websites/${this.websiteUuid}/google-reviews`
    )
  }
}
