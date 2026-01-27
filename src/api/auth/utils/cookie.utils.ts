/*
 * COOKIE UTILITIES
 *
 * Helper functions for cookie management and debugging.
 */

/**
 * Gets a specific cookie value by name
 * @param {string} name - The cookie name
 * @returns {string | null} The cookie value or null if not found
 */
export function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }

  return null
}

export async function debugCORSHeaders(
  url = 'http://localhost:1090/api/v1/notifications/user?requestRut=123456789'
): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // This should trigger CORS
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('🔍 CORS Debug - Response Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      status: response.status,
      ok: response.ok,
    })
  } catch (error) {
    console.error('🚫 CORS Debug - Error:', error)
  }
}

/**
 * Debug function to log all cookies and their values
 * Note: This will NOT show HTTP-only cookies (user_rut, user_role)
 */
export function debugCookies(): void {
  if (typeof document === 'undefined') {
    console.log('🚫 Cannot debug cookies in server environment')
    return
  }

  const cookies = document.cookie
  console.log('🍪 All accessible cookies:', cookies)
  console.log('📝 Note: HTTP-only cookies (user_rut, user_role) are not visible here')

  if (!cookies) {
    console.log('🚫 No accessible cookies found')
    return
  }

  const cookieArray = cookies.split(';').map((cookie) => cookie.trim())
  console.log('🍪 Cookie array:', cookieArray)

  cookieArray.forEach((cookie) => {
    const [name, value] = cookie.split('=')
    console.log(`🍪 ${name}: ${value}`)
  })

  // Also debug Redux state
  try {
    const sessionData = localStorage.getItem('session')
    const settingsData = localStorage.getItem('settings')
    console.log('🔄 Redux session state:', sessionData ? JSON.parse(sessionData) : 'Not found')
    console.log('⚙️ Redux settings state:', settingsData ? JSON.parse(settingsData) : 'Not found')
  } catch (error) {
    console.error('Error debugging Redux state:', error)
  }
}

/**
 * Simple CORS test - just check if server is responding with correct headers
 */
export async function testCORSFix(): Promise<void> {
  try {
    console.log('🧪 Testing CORS fix...')

    const response = await fetch(
      'http://localhost:1090/api/v1/notifications/user?requestRut=123456789',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:3000', // Explicitly set origin
        },
      }
    )

    console.log('✅ CORS Test Results:', {
      status: response.status,
      ok: response.ok,
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      url: response.url,
    })

    if (response.headers.get('Access-Control-Allow-Origin') === '*') {
      console.error(
        '🚫 STILL GETTING WILDCARD - Server not properly restarted or CORS still broken'
      )
    } else {
      console.log('🎉 CORS FIXED! No more wildcard origin.')
    }
  } catch (error) {
    console.error('🚫 CORS Test Failed:', error)
  }
}
