import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of the user object we expect from the backend
interface AuthUser {
  id: number;
  displayName: string;
  email: string;
  avatar: string;
}

// Define the shape of the context value
interface AuthContextType {
  currentUser: AuthUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading initially

  // Function to fetch the current user status from the backend
  const fetchCurrentUser = async () => {
    setIsLoading(true);
    try {
      // Ensure credentials (cookies) are included in the fetch request
      const response = await fetch('http://localhost:3001/api/current-user', {
        method: 'GET',
        credentials: 'include', // Crucial for sending session cookies
        headers: {
          'Accept': 'application/json', // Optional: Ensure backend sends JSON
        }
      });

      if (response.ok) {
        const userData: AuthUser = await response.json();
        setCurrentUser(userData);
      } else if (response.status === 401) {
        setCurrentUser(null); // Explicitly set to null if not authenticated
      } else {
        // Handle other potential errors (e.g., server error)
        console.error('Failed to fetch user status:', response.statusText);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setCurrentUser(null); // Assume logged out on fetch error
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log the user out
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json' // Often needed for POST requests
        }
      });
      if (response.ok) {
        setCurrentUser(null); // Clear user state on successful logout
      } else {
        console.error('Logout failed:', response.statusText);
        // Optionally handle logout errors more gracefully
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user on initial mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Value provided by the context
  const value = { currentUser, setCurrentUser, isLoading, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 