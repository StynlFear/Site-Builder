"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authUtils, authAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  username?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (token: string, userData?: User) => Promise<void>
  logout: () => void
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

// Function to decode JWT token (basic implementation)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      // Try to fetch profile if endpoint exists
      const profileData = await authAPI.getProfile()
      if (profileData && profileData.email) {
        console.log('Profile data from backend:', profileData)
        const userData = {
          id: profileData._id || profileData.id || '',
          email: profileData.email || '',
          username: profileData.username || profileData.name || ''
        }
        setUser(userData)
        localStorage.setItem('userData', JSON.stringify(userData))
        return
      }
    } catch (error) {
      console.log('Profile endpoint not available, using fallback approach')
    }
    
    // Fallback: If profile fetch fails, use stored data or JWT data
    const token = authUtils.getToken()
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded && decoded.userId) {
        // Check if we have user data stored in localStorage from login
        const storedUserData = localStorage.getItem('userData')
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData)
            console.log('Using stored user data:', userData)
            setUser({
              id: decoded.userId,
              email: userData.email || '',
              username: userData.username || ''
            })
            return
          } catch (e) {
            console.error('Error parsing stored user data:', e)
          }
        }
        
        // Final fallback: just set ID from JWT
        console.log('Final fallback: setting user with ID only')
        setUser({
          id: decoded.userId,
          email: '',
          username: ''
        })
      }
    }
  }

  useEffect(() => {
    // Check if user is logged in on app start
    const initAuth = async () => {
      const token = authUtils.getToken()
      if (token) {
        // First check if we have stored user data
        const storedUserData = localStorage.getItem('userData')
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData)
            console.log('Restoring user data from localStorage:', userData)
            setUser(userData)
            setIsLoading(false)
            return
          } catch (e) {
            console.error('Error parsing stored user data:', e)
          }
        }
        
        // If no stored data, try to fetch profile
        await fetchUserProfile()
      }
      setIsLoading(false)
    }
    
    initAuth()
  }, [])

  const login = async (token: string, userData?: User) => {
    console.log('Auth context login called with:', { token: token ? 'exists' : 'none', userData })
    authUtils.setToken(token)
    
    if (userData) {
      console.log('Setting user data:', userData)
      setUser(userData)
      // Store user data in localStorage for future sessions
      localStorage.setItem('userData', JSON.stringify(userData))
    } else {
      console.log('No user data provided, fetching profile')
      // Fetch user profile from backend after setting token
      await fetchUserProfile()
    }
  }

  const logout = () => {
    authUtils.removeToken()
    localStorage.removeItem('userData')
    setUser(null)
    // Force a complete page reload to clear all state and cookies
    window.location.replace('/login')
  }

  const isLoggedIn = !!user

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    fetchUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
