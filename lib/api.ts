import axios from 'axios'
import { config } from './config'
import { cookieUtils } from './cookies'

const API_BASE_URL = config.API_BASE_URL

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/login', { email, password })
    return response.data
  },
  register: async (email: string, password: string, username?: string) => {
    const response = await api.post('/api/register', { email, password, username })
    return response.data
  },
  getProfile: async () => {
    const response = await api.get('/api/profile')
    return response.data
  },
}

// Chat API functions
export const chatAPI = {
  getChats: async () => {
    const response = await api.get('/api/chat')
    return response.data
  },
  createChat: async (title: string) => {
    const response = await api.post('/api/chat/create', { title })
    return response.data
  },
  getChatById: async (chatId: string) => {
    const response = await api.get(`/api/chat/${chatId}`)
    return response.data
  },
  sendMessage: async (chatId: string, message: string) => {
    const response = await api.post(`/api/chat/${chatId}/message`, { 
      sender: 'user', 
      text: message 
    })
    return response.data
  },
  sendChatMessage: async (chatId: string, prompt: string) => {
    const response = await api.post(`/api/chat/${chatId}/chat`, { prompt })
    return response.data
  },
  generateCode: async (chatId: string, prompt: string) => {
    const response = await api.post(`/api/chat/${chatId}/generate`, { prompt })
    return response.data
  },
  getGeneratedCode: async (chatId: string, messageId: string) => {
    const response = await api.get(`/api/chat/${chatId}/code/${messageId}`)
    return response.data
  },
  updateCodeSection: async (chatId: string, codeData: { html?: string, css?: string, js?: string }) => {
    const response = await api.put(`/api/chat/${chatId}/code`, codeData)
    return response.data
  },
}

// Preview API functions
export const previewAPI = {
  getPreview: async (conversationId: string) => {
    const response = await api.get(`/api/preview/${conversationId}`)
    return response.data
  },
  getPreviewByMessage: async (conversationId: string, messageId: string) => {
    const response = await api.get(`/api/preview/${conversationId}/message/${messageId}`)
    return response.data
  },
  getCodeHistory: async (conversationId: string) => {
    const response = await api.get(`/api/preview/${conversationId}/history`)
    return response.data
  },
  getCurrentCode: async (conversationId: string) => {
    const response = await api.get(`/api/preview/${conversationId}/current`)
    return response.data
  },
}

// Standalone code generation
export const generateAPI = {
  generateCode: async (prompt: string) => {
    const response = await api.post('/api/generate', { prompt })
    return response.data
  },
}

// Auth utility functions
export const authUtils = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
      // Use cookie utility for better cookie handling
      cookieUtils.set('authToken', token, 7) // 7 days
    }
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      // Use cookie utility for better cookie removal
      cookieUtils.remove('authToken')
    }
  },
  isLoggedIn: () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken')
    }
    return false
  },
}

export default api
