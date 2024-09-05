import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType{
    isLogged: boolean;
    userId: string | null;
    userInfo: {nome_completo: string} | null; 
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

    const [userId, setUserId] = useState<string | null>(() => {
        const saveUserId = localStorage.getItem('userId')
        return saveUserId || null
    })

    const [userInfo, setUserInfo] = useState<{ nome_completo: string } | null>(null);

    
    useEffect(() => {
        localStorage.setItem('isLogged', String(isLogged));
        if (userId){
            localStorage.setItem('userId', userId);
        } else{
            localStorage.removeItem('userId');
        }
        
    }, [isLogged, userId])
    
    const login = (userId: string ,userInfo: {nome_completo: string}) => {
        setIsLogged(true);
        setUserId(userId.toString());
        setUserInfo(userInfo);
    }
    
    const logout = () => {
        setIsLogged(false);
        setUserId(null)
        setUserInfo(null);  // Limpa as informações do usuário
        localStorage.removeItem('isLogged'); 
        localStorage.removeItem('userId');
    };

    return(
        <AuthContext.Provider value={{ userId, isLogged, userInfo, login, logout }}>
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