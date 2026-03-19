export type CateringRequestData = {
  name: string
  email: string
  phone?: string
  date?: string
  guestCount?: number
  message?: string
  [key: string]: unknown
}

export type EventRequestData = {
  name: string
  email: string
  phone?: string
  eventType?: string
  date?: string
  guestCount?: number
  message?: string
  [key: string]: unknown
}

export type CateringRequestResponse = {
  id: number
  [key: string]: unknown
}

export type EventRequestResponse = {
  id: number
  [key: string]: unknown
}
