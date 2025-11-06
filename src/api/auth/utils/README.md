# Auth Utils

This directory contains modular authentication utility functions split by functionality for better organization and maintainability.

## File Structure

### 📁 `cookie.utils.ts`

Cookie management and debugging utilities.

- `getCookieValue(name)` - Get cookie value by name
- `debugCookies()` - Debug all accessible cookies and Redux state

### 📁 `session.utils.ts`

Session validation and authentication checking.

- `hasAuthenticationCookies()` - Check for auth indicators
- `validateAuthenticationServer(axiosClient)` - Server-side validation
- `hasValidSession()` - Validate session from Redux state

### 📁 `user.utils.ts`

User-specific operations and data retrieval.

- `getCurrentUserRut()` - Get current user RUT
- `isUserLoggedIn()` - Check login status
- `getCurrentUserAffiliationId()` - Get selected affiliation
- `getSessionState()` - Get complete session state

### 📁 `index.ts`

Central export point for clean imports.

### 📁 `auth.utils.ts` (Legacy)

Backward compatibility re-exports.

## Usage Examples

### Preferred Import Patterns

```typescript
// Import specific utilities
import { getCookieValue, debugCookies } from '@/api/auth/utils/cookie.utils';
import { hasValidSession } from '@/api/auth/utils/session.utils';
import { getCurrentUserRut } from '@/api/auth/utils/user.utils';

// Import from index (all utilities)
import { hasValidSession, getCurrentUserRut, debugCookies } from '@/api/auth/utils';

// Legacy import (still works)
import { hasValidSession } from '@/api/auth/utils/auth.utils';
```

### Common Use Cases

```typescript
// Check if user is authenticated
import { hasValidSession } from '@/api/auth/utils';
if (hasValidSession()) {
	// User is authenticated
}

// Get current user info
import { getCurrentUserRut, isUserLoggedIn } from '@/api/auth/utils';
const userRut = getCurrentUserRut();
const isLoggedIn = isUserLoggedIn();

// Debug authentication issues
import { debugCookies } from '@/api/auth/utils';
debugCookies(); // Logs cookies and Redux state
```

## Security Notes

- **HTTP-only cookies** (`user_rut`, `user_role`) cannot be read by JavaScript (by design)
- **API token cookie** is accessible for client-side auth checks
- **Redux session state** stored in `localStorage['session']`
- Real authentication validation happens server-side

## Migration Guide

If you're updating existing imports:

```typescript
// Old
import { hasValidSession } from '@/api/auth/utils/auth.utils';

// New (preferred)
import { hasValidSession } from '@/api/auth/utils';

// Or specific module
import { hasValidSession } from '@/api/auth/utils/session.utils';
```
