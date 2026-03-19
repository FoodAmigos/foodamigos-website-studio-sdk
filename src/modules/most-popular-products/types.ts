export type PopularProduct = {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  imageUrl?: string
  rank: number
  [key: string]: unknown
}
