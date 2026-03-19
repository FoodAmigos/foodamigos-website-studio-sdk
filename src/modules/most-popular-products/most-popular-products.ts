import type { HttpClient } from "../../core/client"
import type { PopularProduct } from "./types"

export class MostPopularProductsModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  list(): Promise<PopularProduct[]> {
    return this.client.fetchData<PopularProduct[]>(
      `/api/websites/${this.websiteUuid}/most-popular-products`
    )
  }
}
