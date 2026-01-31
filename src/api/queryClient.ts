import { QueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const MAX_RETRIES = 2

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError) {
          if (error.response && typeof error.response.status === 'number') {
            if (error.response.status >= 400 && error.response.status <= 499) {
              return false
            }
          }
        }
        return failureCount <= MAX_RETRIES
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export default queryClient
