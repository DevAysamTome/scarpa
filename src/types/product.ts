export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  stock: number
  images: string[]
  categoryId: string
  sizes: string[]
  colors: string[]
  createdAt?: string
  status?: 'active' | 'inactive'
} 