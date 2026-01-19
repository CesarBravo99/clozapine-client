import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserSecurity } from '@/api/profile'
import type { AxiosInstance } from 'axios'

interface UpdateSecurityRequest {
  onlyOneSessionPerDevice?: boolean
  showProfilePicture?: boolean
}

export function useUpdateSecurityMutation(axiosClient: AxiosInstance, userRut: number) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateSecurityRequest>({
    mutationFn: (securityData) => updateUserSecurity(userRut, securityData, axiosClient),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', userRut] })
    },
    onError: (error) => {
      console.error('Failed to update security settings:', error.message)
    },
  })
}
