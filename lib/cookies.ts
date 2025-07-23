// Cookie utility functions
export const cookieUtils = {
  set: (name: string, value: string, days: number = 7) => {
    if (typeof document !== 'undefined') {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
    }
  },

  get: (name: string): string | null => {
    if (typeof document !== 'undefined') {
      const nameEQ = name + '='
      const ca = document.cookie.split(';')
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  },

  remove: (name: string) => {
    if (typeof document !== 'undefined') {
      // Multiple approaches to ensure cookie deletion
      const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT'
      const domain = window.location.hostname
      
      // Basic removal
      document.cookie = `${name}=; path=/; expires=${pastDate}`
      document.cookie = `${name}=; path=/; max-age=0`
      
      // With domain
      document.cookie = `${name}=; path=/; expires=${pastDate}; domain=${domain}`
      document.cookie = `${name}=; path=/; max-age=0; domain=${domain}`
      
      // With leading dot domain (for subdomains)
      if (domain !== 'localhost') {
        document.cookie = `${name}=; path=/; expires=${pastDate}; domain=.${domain}`
        document.cookie = `${name}=; path=/; max-age=0; domain=.${domain}`
      }
      
      // Without path (for cookies set without path)
      document.cookie = `${name}=; expires=${pastDate}`
      document.cookie = `${name}=; max-age=0`
    }
  },

  exists: (name: string): boolean => {
    return cookieUtils.get(name) !== null
  }
}

export default cookieUtils
