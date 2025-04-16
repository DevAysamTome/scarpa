export interface CarouselSlide {
  id: string
  imageUrl: string
  title: string
  description: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCarouselSlideInput {
  imageUrl: string
  title: string
  description: string
  order?: number
  isActive?: boolean
} 