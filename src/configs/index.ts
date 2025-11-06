const getEnvVar = (key: string, defaultValue?: string): string => {
	const value = import.meta.env[key];
	if (value === undefined) {
		if (defaultValue !== undefined) {
			return defaultValue;
		}
		throw new Error(`Environment variable ${key} is not set.`);
	}
	return value;
};

export const config = {
	apiUrl: getEnvVar('CLOZAPINE_API_URL', 'http://localhost:1090'),
};
