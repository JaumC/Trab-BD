import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { api } from "./axiosConfig";

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

    const [loading, setLoading] = useState(true);

    const [userInfo, setUserInfo] = useState<{ nome_completo: string } | null>(null);

    // Função para buscar as informações do usuário autenticado
    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/user-info/${userId}`);  // URL da API que retorna as informações do usuário
            const userData = response.data;
            
            if (userData) {
                setUserInfo(userData);
                setIsLogged(true); // Se a informação do usuário for válida, ele está logado
            } else {
                setIsLogged(false); // Se não houver informações de usuário, o usuário não está logado
            }
        } catch (error) {
            console.error('Erro ao buscar as informações do usuário:', error);
            setIsLogged(false); // Se houver um erro, considera que o usuário não está logado
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        localStorage.setItem('isLogged', String(isLogged));
        if (userId){
            localStorage.setItem('userId', userId);
        } else{
            localStorage.removeItem('userId');
        }
        
    }, [isLogged, userId])

    // Efeito colateral para verificar a autenticação na inicialização
    useEffect(() => {
        fetchUserInfo(); // Buscar as informações do usuário assim que o componente monta
    }, []);
    
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
        <AuthContext.Provider value={{ userId, isLogged, userInfo, login, logout, fetchUserInfo }}>
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