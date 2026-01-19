/*
 * SECURE PERMISSION API
 *
 * Client-side API for checking permissions via server-side validation.
 * All authorization decisions are made server-side for security.
 */

import type { AxiosInstance } from 'axios'

export interface PermissionCheckRequest {
  action: string
  resourceId?: number
}

export interface PermissionCheckResponse {
  allowed: boolean
  message: string
}

export interface UserPermissionsResponse {
  permissions: string[]
  userRole: number
}

/**
 * Check if the current user has permission for a specific action
 * @param request - The permission check request
 * @param axiosClient - Configured axios client with authentication
 * @returns Promise with permission result
 */
export const checkPermission = async (
  request: PermissionCheckRequest,
  axiosClient: AxiosInstance
): Promise<PermissionCheckResponse> => {
  try {
    const response = await axiosClient.post('/api/auth/check-permission', request)
    return response.data
  } catch (error) {
    console.error('Permission check failed:', error)
    // Default to denied on error for security
    return {
      allowed: false,
      message: 'Permission check failed',
    }
  }
}

/**
 * Get all permissions for the current user
 * @param axiosClient - Configured axios client with authentication
 * @returns Promise with user permissions
 */
export const getUserPermissions = async (
  axiosClient: AxiosInstance
): Promise<UserPermissionsResponse> => {
  try {
    const response = await axiosClient.get('/api/auth/permissions')
    return response.data
  } catch (error) {
    console.error('Failed to get user permissions:', error)
    // Default to no permissions on error for security
    return {
      permissions: [],
      userRole: -1,
    }
  }
}

/**
 * Secure logout that clears server-side session
 * @param axiosClient - Configured axios client
 * @returns Promise with logout result
 */
export const secureLogout = async (
  axiosClient: AxiosInstance
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axiosClient.post('/logout')
    return response.data
  } catch (error) {
    console.error('Logout failed:', error)
    // Even if logout fails, consider it successful for UX
    return {
      success: true,
      message: 'Logged out',
    }
  }
}

// Pre-defined permission actions for type safety
export const PermissionActions = {
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  VIEW_REPORTS: 'view_reports',
  MANAGE_USERS: 'manage_users',
  VIEW_PATIENT_DATA: 'view_patient_data',
  EDIT_SETTINGS: 'edit_settings',
} as const

export type PermissionAction = (typeof PermissionActions)[keyof typeof PermissionActions]
