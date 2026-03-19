import type { HttpClient } from "../../core/client"
import type {
  CateringRequestData,
  CateringRequestResponse,
  EventRequestData,
  EventRequestResponse,
} from "./types"

export class RequestsModule {
  private client: HttpClient
  private websiteUuid: string

  constructor(client: HttpClient, websiteUuid: string) {
    this.client = client
    this.websiteUuid = websiteUuid
  }

  createCateringRequest(
    companyId: string,
    data: CateringRequestData
  ): Promise<CateringRequestResponse> {
    return this.client.fetch<CateringRequestResponse>(
      `/api/websites/${this.websiteUuid}/catering-request/${companyId}`,
      { method: "POST", body: data }
    )
  }

  createEventRequest(
    companyId: string,
    data: EventRequestData
  ): Promise<EventRequestResponse> {
    return this.client.fetch<EventRequestResponse>(
      `/api/websites/${this.websiteUuid}/event-request/${companyId}`,
      { method: "POST", body: data }
    )
  }
}
