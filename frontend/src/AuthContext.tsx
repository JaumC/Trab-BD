import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType{
    isLogged: boolean;
    login: () => void;
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

    useEffect(() => {
        localStorage.setItem('isLogged', String(isLogged))
    }, [isLogged])

    const login = () => setIsLogged(true);
    const logout = () => {
        setIsLogged(false);
        localStorage.removeItem('isLogged'); 
    };

    return(
        <AuthContext.Provider value={{ isLogged, login, logout }}>
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