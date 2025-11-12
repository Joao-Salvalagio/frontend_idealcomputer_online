import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interface dos dados embutidos no token JWT
interface DecodedToken {
    sub: string; // email
    nome: string;
    cargo: string;
    funcao: 'USUARIO' | 'ADMINISTRADOR';
    exp?: number; // timestamp de expiração
}

// Interface do objeto de usuário
interface User {
    email: string;
    name: string;
    cargo: string;
    role: 'USUARIO' | 'ADMINISTRADOR';
}

// O que o Context vai fornecer
interface AuthContextType {
    isLoggedIn: boolean;
    isAdmin: boolean;
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider que "abraça" a aplicação
interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [user, setUser] = useState<User | null>(null);

    // Executa sempre que o token mudar
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                
                // Verificar se o token expirou
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    console.error("Token expirado, limpando...");
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                    return;
                }
                
                // Extrair dados do token
                setUser({
                    email: decoded.sub,
                    name: decoded.nome,
                    cargo: decoded.cargo,
                    role: decoded.funcao,
                });
            } catch (error) {
                console.error("Token inválido, limpando...", error);
                localStorage.removeItem('auth_token');
                setToken(null);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
    };

    const isLoggedIn = !!token;
    const isAdmin = user?.role === 'ADMINISTRADOR';

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o Context facilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
