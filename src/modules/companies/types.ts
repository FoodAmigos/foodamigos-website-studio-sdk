export type Company = {
  uuid: string
  name: string
  address?: string
  opening_hours?: unknown
  locations?: unknown
  [key: string]: unknown
}
