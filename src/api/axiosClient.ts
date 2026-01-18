import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { CONFIG } from '@/configs' // Import your centralized config

const axiosClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
    // You can add other common headers here
  },
  timeout: 10000, // Optional: request timeout
  withCredentials: true, // Essential for sending HTTP-only cookies
})

// Optional: Request Interceptor (e.g., to add an auth token)
axiosClient.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }
    return requestConfig
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Optional: Response Interceptor (e.g., for global error handling)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response.data)
      console.error('Status:', error.response.status)
      console.error('Headers:', error.response.headers)
      if (error.response.status === 401) {
        console.log('Unauthorized access')
        window.location.href = '/'
      }
    } else if (error.request) {
      console.error('API No Response:', error.request)
    } else {
      console.error('API Request Setup Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default axiosClient
