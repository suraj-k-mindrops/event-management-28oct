import { useAuth } from '@/context/AuthContext.jsx';

export function AuthDebug() {
  const { token, user, isAuthenticated, isLoading } = useAuth();
  
  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Token: {token ? 'Present' : 'None'}</div>
      <div>User: {user ? 'Present' : 'None'}</div>
    </div>
  );
}
