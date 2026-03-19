import type { FoodamigosSdkConfig, RequestOptions, ApiError } from "./types"

export class HttpClient {
  private baseUrl: string
  private websiteUuid: string
  private debug: boolean

  constructor(config: FoodamigosSdkConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")
    this.websiteUuid = config.websiteUuid
    this.debug = config.debug ?? false
  }

  async fetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options

    const url = `${this.baseUrl}${path}`

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "x-website-uuid": this.websiteUuid,
      ...headers,
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      ...(body !== undefined && { body: JSON.stringify(body) }),
    }

    if (this.debug) {
      console.log(`[FoodamigosSdk] --> ${method} ${url}`, {
        headers: requestHeaders,
        ...(body !== undefined && { body }),
      })
    }

    const response = await fetch(url, requestInit)

    let data: unknown
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (this.debug) {
      console.log(`[FoodamigosSdk] <-- ${response.status} ${url}`, data)
    }

    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        message:
          typeof data === "object" &&
          data !== null &&
          "message" in data &&
          typeof (data as Record<string, unknown>).message === "string"
            ? (data as Record<string, string>).message
            : `Request failed with status ${response.status}`,
        data,
      }
      throw error
    }

    return data as T
  }
}
