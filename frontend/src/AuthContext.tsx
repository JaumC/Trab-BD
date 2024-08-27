import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType{
    isLogged: boolean;
    userId: string | null;
    login: (userId: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLogged, setIsLogged] = useState<boolean>(() => {
        const saveLogin = localStorage.getItem('isLogged')
        return saveLogin === 'true'
    })

    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        localStorage.setItem('isLogged', String(isLogged))
    }, [isLogged])

    const login = (userId: string) => {
        setIsLogged(true);
        setUserId(userId.toString());
    }
    
    const logout = () => {
        setIsLogged(false);
        setUserId(null)
        localStorage.removeItem('isLogged'); 
    };

    return(
        <AuthContext.Provider value={{ userId, isLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};