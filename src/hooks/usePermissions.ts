/*
 * SECURE PERMISSION HOOK
 *
 * React hook for checking permissions with server-side validation.
 * Provides a secure and easy way to check permissions in components.
 */

import { useQuery } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { checkPermission, getUserPermissions, type PermissionAction } from '@/api/auth/permissions'

/**
 * Hook to check a specific permission
 * @param action - The permission action to check
 * @param resourceId - Optional resource ID for resource-specific permissions
 * @returns Query result with permission status
 */
export const usePermissionCheck = (action: PermissionAction, resourceId?: number) => {
  const { axiosClient } = useRouteContext({ from: '__root__' })

  return useQuery({
    queryKey: ['permission', action, resourceId],
    queryFn: () => checkPermission({ action, resourceId }, axiosClient),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once for security
    // Default to denied while loading for security
    placeholderData: { allowed: false, message: 'Checking permissions...' },
  })
}

/**
 * Hook to get all user permissions
 * @returns Query result with all user permissions
 */
export const useUserPermissions = () => {
  const { axiosClient } = useRouteContext({ from: '__root__' })

  return useQuery({
    queryKey: ['user-permissions'],
    queryFn: () => getUserPermissions(axiosClient),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
    // Default to no permissions while loading for security
    placeholderData: { permissions: [], userRole: -1 },
  })
}

/**
 * Hook to check if user has any of the specified permissions
 * @param actions - Array of permission actions to check
 * @returns Object with loading state and hasAnyPermission boolean
 */
export const useHasAnyPermission = (actions: PermissionAction[]) => {
  const { data: userPermissions, isLoading } = useUserPermissions()

  const hasAnyPermission =
    userPermissions?.permissions.some((permission) =>
      actions.includes(permission as PermissionAction)
    ) ?? false

  return {
    hasAnyPermission,
    isLoading,
    permissions: userPermissions?.permissions ?? [],
  }
}

/**
 * Hook to check if user has all of the specified permissions
 * @param actions - Array of permission actions to check
 * @returns Object with loading state and hasAllPermissions boolean
 */
export const useHasAllPermissions = (actions: PermissionAction[]) => {
  const { data: userPermissions, isLoading } = useUserPermissions()

  const hasAllPermissions = actions.every((action) => userPermissions?.permissions.includes(action))

  return {
    hasAllPermissions,
    isLoading,
    permissions: userPermissions?.permissions ?? [],
  }
}
