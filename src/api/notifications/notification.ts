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
    console.log(`Notification request: ${userRut}`)

    const response = await axiosClient.get<Notification[]>(
      `api/v1/notifications/user?requestRut=${userRut}`
    )

    console.log('✅ NOTIFICATIONS response success:', response)
    return response.data
  } catch (error: unknown) {
    console.error('Error fetching notifications in API call:', error)
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
    console.error('Error completing notification:', error)
    throw error
  }
}
