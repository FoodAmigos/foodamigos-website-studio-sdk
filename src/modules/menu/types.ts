export type MenuItem = {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  available: boolean
  imageUrl?: string
  [key: string]: unknown
}

export type MenuCategory = {
  id: string
  name: string
  description?: string
  items: MenuItem[]
  [key: string]: unknown
}

export type Menu = {
  id: string
  name: string
  description?: string
  companyId: string
  categories: MenuCategory[]
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}

export type MenuListItem = {
  id: string
  name: string
  description?: string
  companyId: string
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}
