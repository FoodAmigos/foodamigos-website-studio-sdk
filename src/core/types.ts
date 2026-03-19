export type FoodamigosSdkConfig = {
  websiteUuid: string
  baseUrl: string
  debug?: boolean
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
}

export type ApiError = {
  status: number
  message: string
  data?: unknown
}
