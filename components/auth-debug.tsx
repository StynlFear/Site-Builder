"use client"

import { useAuth } from "@/lib/auth-context"
import { authUtils } from "@/lib/api"
import { cookieUtils } from "@/lib/cookies"

// Function to decode JWT token (same as in auth-context)
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

export function AuthDebug() {
  const { user, isLoading, isLoggedIn, logout } = useAuth()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const clearTokensManually = () => {
    // Manual token clearing for debugging
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      cookieUtils.remove('authToken')
      window.location.reload()
    }
  }

  const token = authUtils.getToken()
  const decodedToken = token ? decodeJWT(token) : null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50 max-w-xs">
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Logged In: {isLoggedIn ? 'true' : 'false'}</div>
      <div>User: {user ? JSON.stringify(user, null, 2) : 'null'}</div>
      <div>LocalStorage Token: {authUtils.getToken() ? 'exists' : 'none'}</div>
      <div>Cookie Token: {cookieUtils.exists('authToken') ? 'exists' : 'none'}</div>
      
      {decodedToken && (
        <div className="mt-2 border-t border-gray-600 pt-2">
          <div className="text-yellow-300">Decoded JWT:</div>
          <div className="text-yellow-200 text-xs break-all">
            {JSON.stringify(decodedToken, null, 2)}
          </div>
        </div>
      )}
      
      <div className="mt-2 space-x-1">
        <button 
          onClick={logout} 
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Logout
        </button>
        <button 
          onClick={clearTokensManually} 
          className="bg-orange-600 px-2 py-1 rounded text-xs"
        >
          Clear Tokens
        </button>
      </div>
      <div className="mt-2 text-yellow-300">All Cookies:</div>
      <div className="text-yellow-200 text-xs break-all">
        {typeof document !== 'undefined' ? document.cookie || 'none' : 'server'}
      </div>
    </div>
  )
}
