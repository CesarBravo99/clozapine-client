import { createAsyncThunk } from '@reduxjs/toolkit'
import type { AxiosInstance } from 'axios'
import validateToken, { type ValidateTokenData } from '@/api/auth/token.validate'
import { refreshUserSession, type SessionRefreshResponse } from '@/api/auth/user.refresh'

interface ValidateParams {
  claims: ValidateTokenData
  axiosClient: AxiosInstance
}

export const validateLoggedIn = createAsyncThunk(
  'session/validateLoggedIn',
  async ({ claims, axiosClient }: ValidateParams) => {
    try {
      const response = await validateToken(claims, axiosClient)
      console.log('validateLoggedIn response', response)
      return response.valid
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }
)

export const refreshSession = createAsyncThunk<SessionRefreshResponse, void>(
  'session/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshUserSession()
      console.log('Session refresh successful:', response)
      return response
    } catch (error: unknown) {
      console.error('Session refresh failed:', error)
      const errorMessage = (error as any).response?.data?.error || 'Session refresh failed'
      return rejectWithValue(errorMessage)
    }
  }
)
