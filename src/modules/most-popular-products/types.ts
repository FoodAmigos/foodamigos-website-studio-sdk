export type PopularProduct = {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  image?: { id: number; url: string; name: string; type: string; extension: string } | null
  rank: number
  [key: string]: unknown
}
