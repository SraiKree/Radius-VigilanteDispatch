import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider - Provides global auth state including admin mode
 */
export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);

    const login = (adminMode) => {
        setIsAdmin(adminMode);
    };

    const logout = () => {
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
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
