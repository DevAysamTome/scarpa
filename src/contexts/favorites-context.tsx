'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@/types/product'

interface FavoritesContextType {
  favorites: string[]
  favoritesCount: number
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  favoritesCount: 0,
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  isFavorite: () => false,
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (productId: string) => {
    setFavorites(prev => [...prev, productId])
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        favoritesCount: favorites.length,
        addToFavorites, 
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext) 