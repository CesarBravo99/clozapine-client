import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changePassword } from '@/api/profile'
import type { AxiosInstance } from 'axios'

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export function useChangePasswordMutation(axiosClient: AxiosInstance, userRut: number) {
  const queryClient = useQueryClient()

  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: (passwordData) => changePassword(userRut, passwordData, axiosClient),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', userRut] })
    },
    onError: (error) => {
      console.error('Failed to change password:', error.message)
    },
  })
}
