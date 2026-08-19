import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

/**
 * Provides the logged-in user (or null) and auth actions to the whole app.
 * Checks for an existing session on mount via /auth/me.php.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authApi
            .me()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (credentials) => {
        const loggedInUser = await authApi.login(credentials);
        setUser(loggedInUser);
        return loggedInUser;
    }, []);

    const register = useCallback(async (details) => {
        const newUser = await authApi.register(details);
        setUser(newUser);
        return newUser;
    }, []);

    const logout = useCallback(async () => {
        await authApi.logout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/** @returns {{user: object|null, loading: boolean, login: Function, register: Function, logout: Function}} */
export function useAuth() {
    return useContext(AuthContext);
}
