# 🔒 Security Migration: Credentials to Session State

## 🚨 Critical Security Issues Addressed

### Before (Insecure):

- ❌ User roles stored in localStorage (persistent XSS risk)
- ❌ Sensitive credentials in Redux state (DevTools exposure)
- ❌ Client-side authorization decisions possible
- ❌ Credentials survive browser restart (session hijacking)

### After (Secure):

- ✅ Only UI state in Redux (no sensitive data)
- ✅ Real authorization via HTTP-only cookies
- ✅ Server-side permission validation only
- ✅ Secure session management

## 📋 Migration Checklist

### 1. Update Redux Store References

```typescript
// OLD - Insecure
import { selectCredentials, setCredsState } from '@/redux/creds/creds.slice';
const credentials = useSelector(selectCredentials);
const userRole = credentials.userRole; // ❌ Never trust client-side roles!

// NEW - Secure
import { selectUserRut, sessionLogin } from '@/redux/creds/creds.slice';
const userRut = useSelector(selectUserRut); // ✅ Safe for display only

// For authorization, always check with server:
const hasPermission = await api.post('/check-permission', { action: 'view_reports' });
```

### 2. Replace Authorization Checks

```typescript
// OLD - Insecure client-side authorization
if (userRole === UserRole.Admin) {
	// ❌ NEVER trust client-side role checks!
	showAdminPanel();
}

// NEW - Secure server-side authorization
const canViewAdmin = await api.get('/permissions/admin-panel');
if (canViewAdmin.data.allowed) {
	showAdminPanel();
}
```

### 3. Update Component Patterns

```typescript
// OLD - Dangerous
const ProtectedComponent = () => {
  const role = useSelector(selectCredentials).userRole;
  if (role !== UserRole.Admin) return null; // ❌ Bypassable
  return <AdminPanel />;
};

// NEW - Secure
const ProtectedComponent = () => {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions', 'admin'],
    queryFn: () => api.get('/permissions/admin-panel')
  });

  if (isLoading) return <Loading />;
  if (!permissions?.allowed) return <AccessDenied />;
  return <AdminPanel />;
};
```

## 🛡️ Security Architecture

### Client-Side (Redux Session)

- **Purpose**: UI state management only
- **Contains**: Login status, selected affiliation, user RUT (display)
- **Does NOT contain**: Roles, permissions, tokens
- **Storage**: localStorage (safe data only)

### Server-Side (HTTP-Only Cookies)

- **Purpose**: Real authentication & authorization
- **Contains**: User RUT, role, session token
- **Security**: HTTPOnly, Secure, SameSite=Strict
- **Validation**: Every protected request

## 🔧 Implementation Notes

### Session Management

```typescript
// Login
dispatch(
	sessionLogin({
		userRut: user.userRut, // ✅ Safe for display
		selectedAffiliationId: 123, // ✅ UI state only
	})
);

// Logout
dispatch(sessionLogout()); // Clears Redux + localStorage
// Server must also clear HTTP-only cookies
```

### Protected API Calls

```typescript
// All protected calls automatically include HTTP-only cookies
const response = await axiosClient.get('/protected-endpoint');
// Server validates cookies, not client-side state
```

## ⚠️ Common Migration Pitfalls

1. **Don't check roles client-side for security**

    - Use server endpoints for authorization
    - Client checks are for UX only (showing/hiding UI elements)

2. **Don't store tokens in Redux/localStorage**

    - Use HTTP-only cookies for session tokens
    - Let the browser handle cookie management

3. **Don't trust any client-side data for authorization**
    - Always validate permissions server-side
    - Client state is for UI/UX enhancement only

## 🎯 Next Steps

1. Update all components using `selectCredentials`
2. Replace client-side authorization with server checks
3. Add server-side permission validation endpoints
4. Test with Redux DevTools to ensure no sensitive data visible
5. Clear existing localStorage credentials from user browsers

## 📞 Need Help?

If you find components that need updating, always ask:

- "Is this authorization or just UI state?"
- "Should this decision be made server-side?"
- "What happens if a malicious user modifies this client-side?"
