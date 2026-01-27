import type { AxiosInstance } from 'axios'
import type { Notification } from '@/domain/notification.types'

export const getNotificationsByUser = async (
  userRut: number | undefined,
  axiosClient: AxiosInstance
): Promise<Notification[]> => {
  if (userRut === undefined) {
    console.warn('getNotificationsByUser called with undefined userRut.')
    return []
  }

  try {
    console.log('🔔 Making notification request:', {
      userRut,
      url: `api/v1/notifications/user?requestRut=${userRut}`,
      baseURL: axiosClient.defaults.baseURL,
      withCredentials: axiosClient.defaults.withCredentials,
    })

    const response = await axiosClient.get<Notification[]>(
      `api/v1/notifications/user?requestRut=${userRut}`
    )

    console.log('✅ NOTIFICATIONS response success:', response)
    return response.data
  } catch (error: any) {
    console.error('❌ Error fetching notifications in API call:', error)

    // Enhanced error logging for CORS issues
    if (error.message === 'Network Error') {
      console.error('🚫 CORS Error Details:', {
        message: 'Network Error typically indicates CORS blocking',
        possibleCauses: [
          'CORS Access-Control-Allow-Origin header mismatch',
          'Server not setting proper CORS headers',
          'Browser blocking due to credentials + wildcard origin',
        ],
        troubleshooting: [
          'Check server CORS configuration',
          'Verify server is running on port 1090',
          'Clear browser cache and cookies',
          'Check browser developer tools Network tab',
        ],
      })
    }

    throw error
  }
}

export interface CompleteNotificationPayload {
  notificationId: string
  completedBy: number
  notes?: string
}

export const completeNotification = async (
  payload: CompleteNotificationPayload,
  axiosClient: AxiosInstance
): Promise<Notification> => {
  try {
    const response = await axiosClient.post<Notification>('api/v1/notifications/complete', payload)

    return response.data
  } catch (error) {
    console.error('❌ Error completing notification:', error)
    throw error
  }
}
