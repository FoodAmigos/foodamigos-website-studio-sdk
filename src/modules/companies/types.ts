export type Company = {
  uuid: string
  name: string
  address?: string
  phone_number?: string
  city?: string
  zip_code?: string
  email?: string
  lat?: number
  lon?: number
  is_live?: boolean
  google_place?: string
  opening_hours?: unknown
  locations?: unknown
  [key: string]: unknown
}
