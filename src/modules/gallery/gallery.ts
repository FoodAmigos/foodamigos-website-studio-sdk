import type { HttpClient } from "../../core/client"
import type { GalleryMedia } from "./types"

export class GalleryModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  list(): Promise<GalleryMedia[]> {
    return this.client.fetchData<GalleryMedia[]>(
      `/api/websites/${this.websiteUuid}/gallery`
    )
  }
}
