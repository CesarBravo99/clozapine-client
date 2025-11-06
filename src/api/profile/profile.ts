import type { AxiosInstance } from 'axios';
import type {
	UserProfileData,
	UpdateUserProfileRequest,
	UpdateUserSettingsRequest,
	ChangePasswordRequest,
} from './types/profile.types';

/**
 * Get user profile data (user info, settings, credentials, affiliations)
 */
export const getUserProfile = async (
	userRut: number,
	axiosClient: AxiosInstance
): Promise<UserProfileData> => {
	try {
		const response = await axiosClient.get(`/api/v1/profile/${userRut}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching user profile:', error);
		throw new Error('Failed to fetch user profile');
	}
};

/**
 * Update user profile information (personal data)
 */
export const updateUserProfile = async (
	userRut: number,
	profileData: UpdateUserProfileRequest,
	axiosClient: AxiosInstance
): Promise<void> => {
	try {
		await axiosClient.put(`/api/v1/profile/${userRut}`, profileData);
	} catch (error) {
		console.error('Error updating user profile:', error);
		throw new Error('Failed to update user profile');
	}
};

/**
 * Update user settings (preferences)
 */
export const updateUserSettings = async (
	userRut: number,
	settingsData: UpdateUserSettingsRequest,
	axiosClient: AxiosInstance
): Promise<void> => {
	try {
		await axiosClient.put(`/api/v1/profile/${userRut}/settings`, settingsData);
	} catch (error) {
		console.error('Error updating user settings:', error);
		throw new Error('Failed to update user settings');
	}
};

/**
 * Change user password
 */
export const changePassword = async (
	userRut: number,
	passwordData: ChangePasswordRequest,
	axiosClient: AxiosInstance
): Promise<void> => {
	try {
		await axiosClient.post(`/api/v1/profile/${userRut}/change-password`, passwordData);
	} catch (error) {
		console.error('Error changing password:', error);
		if (error instanceof Error && error.message.includes('401')) {
			throw new Error('Current password is incorrect');
		}
		throw new Error('Failed to change password');
	}
};

/**
 * Update user preferences (theme, language, notifications)
 */
export const updateUserPreferences = async (
	userRut: number,
	preferences: {
		userTheme?: string;
		userLanguage?: string;
		userFontSize?: number;
		userTimezone?: string;
		emailNotifications?: boolean;
		whatsappNotifications?: boolean;
	},
	axiosClient: AxiosInstance
): Promise<void> => {
	try {
		const settingsData: UpdateUserSettingsRequest = {
			...preferences,
		};
		await axiosClient.put(`/api/v1/profile/${userRut}/settings`, settingsData);
	} catch (error) {
		console.error('Error updating user preferences:', error);
		throw new Error('Failed to update user preferences');
	}
};

/**
 * Update user security settings
 */
export const updateUserSecurity = async (
	userRut: number,
	securityData: {
		onlyOneSessionPerDevice?: boolean;
		showProfilePicture?: boolean;
	},
	axiosClient: AxiosInstance
): Promise<void> => {
	try {
		const settingsData: UpdateUserSettingsRequest = {
			...securityData,
		};
		await axiosClient.put(`/api/v1/profile/${userRut}/settings`, settingsData);
	} catch (error) {
		console.error('Error updating user security settings:', error);
		throw new Error('Failed to update user security settings');
	}
};
