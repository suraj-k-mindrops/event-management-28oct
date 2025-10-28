/**
 * Authentication Verification Script
 * Run this in browser console (F12 → Console) to verify authentication
 * 
 * Copy and paste the entire script, or run individual checks
 */

console.log('%c=== AUTHENTICATION VERIFICATION ===', 'color: blue; font-size: 16px; font-weight: bold');

// Check 1: Token Exists
const token = localStorage.getItem('auth_token');
console.log('\n📋 Check 1: Token');
if (token) {
  console.log('✅ Token: Present');
  console.log('   Length:', token.length);
  console.log('   Preview:', token.substring(0, 50) + '...');
} else {
  console.log('❌ Token: MISSING');
  console.log('   Solution: You need to login first');
}

// Check 2: Token Format (JWT)
if (token) {
  console.log('\n📋 Check 2: Token Format (JWT)');
  const parts = token.split('.');
  if (parts.length === 3) {
    console.log('✅ JWT Format: Valid (has 3 parts)');
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('   User ID:', payload.id || 'N/A');
      console.log('   User Role:', payload.role || 'N/A');
      console.log('   Issued:', new Date(payload.iat * 1000).toLocaleString());
      console.log('   Expires:', new Date(payload.exp * 1000).toLocaleString());
      
      // Check if expired
      if (Date.now() / 1000 > payload.exp) {
        console.log('⚠️ Token: EXPIRED');
      } else {
        console.log('✅ Token: Valid (not expired)');
      }
    } catch (e) {
      console.log('❌ Unable to decode token');
    }
  } else {
    console.log('❌ JWT Format: Invalid (should have 3 parts separated by dots)');
  }
}

// Check 3: User Role
console.log('\n📋 Check 3: User Role');
const userStr = localStorage.getItem('user');
if (userStr) {
  try {
    const user = JSON.parse(userStr);
    console.log('✅ User Data: Present');
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    
    // Check permissions
    const canManage = user.role === 'ADMIN' || user.role === 'ORGANIZER';
    if (canManage) {
      console.log('✅ Permission: Can manage venues');
    } else {
      console.log('❌ Permission: CANNOT manage venues');
      console.log('   Required: ADMIN or ORGANIZER');
      console.log('   Current:', user.role);
    }
  } catch (e) {
    console.log('❌ User data is not valid JSON');
  }
} else {
  console.log('⚠️ User Data: Not in localStorage (check AuthContext state)');
}

// Check 4: API Configuration
console.log('\n📋 Check 4: API Configuration');
const apiConfig = {
  backendUrl: 'http://localhost:5000',
  frontendUrl: 'http://localhost:8080',
};
console.log('Backend URL:', apiConfig.backendUrl);
console.log('Frontend URL:', apiConfig.frontendUrl);

// Check 5: Network Test (Optional - run after page load)
console.log('\n📋 Check 5: Network Test');
console.log('To test network connectivity:');
console.log('1. Open Network tab (F12 → Network)');
console.log('2. Submit venue form');
console.log('3. Look for POST request to /api/venues');
console.log('4. Check if Authorization header is sent');

// Summary
console.log('\n=== VERIFICATION SUMMARY ===');
console.log(`Token: ${token ? '✅ Present' : '❌ Missing'}`);
console.log(`Format: ${token && token.split('.').length === 3 ? '✅ Valid JWT' : '❌ Invalid'}`);
console.log(`User: ${userStr ? '✅ Loaded' : '⚠️ Not loaded'}`);

if (token && token.split('.').length === 3) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const canManage = payload.role === 'ADMIN' || payload.role === 'ORGANIZER';
    console.log(`Permissions: ${canManage ? '✅ Can manage' : '❌ Cannot manage'}`);
  } catch (e) {
    console.log('Permissions: ❓ Unable to verify');
  }
} else {
  console.log('Permissions: ❓ Cannot verify (token invalid)');
}

console.log('\n=== NEXT STEPS ===');
if (!token) {
  console.log('1. ❌ Login to the application');
} else if (token && token.split('.').length === 3) {
  console.log('1. ✅ Authentication setup is correct');
  console.log('2. ✅ Send this report to backend developer');
  console.log('3. Backend needs to fix validation logic');
} else {
  console.log('1. ⚠️ Token format is invalid - contact support');
}

// Provide quick copy command for network testing
console.log('\n=== QUICK TEST COMMAND ===');
console.log('Run this in another tab to test API:');
console.log('fetch("http://localhost:5000/api/venues", { headers: { "Authorization": "Bearer ' + (token || 'YOUR_TOKEN') + '" } })');

console.log('\n%c✅ Verification Complete', 'color: green; font-size: 14px; font-weight: bold');

