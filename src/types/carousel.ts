export interface CarouselSlide {
  id: string
  image: string
  title: string
  description: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCarouselSlideInput {
  image: string
  title: string
  description: string
  order?: number
  isActive?: boolean
} 