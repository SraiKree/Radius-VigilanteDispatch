import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider - Provides global auth state including admin mode and user data
 */
export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState(null);

    const login = (adminMode, userData = null) => {
        setIsAdmin(adminMode);
        setUser(userData);
    };

    const logout = () => {
        setIsAdmin(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * useAuth - Hook to consume auth context
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
