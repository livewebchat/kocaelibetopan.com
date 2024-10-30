import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  signin: (username: string, password: string) => Promise<{ success: boolean }>;
  signout: () => void;
  loading: boolean;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = `${import.meta.env.VITE_APP_API_URL}/signin`;

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signin = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean }> => {
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(
          errorData.message || 'Giriş başarısız, lütfen tekrar deneyin.',
        );
        setLoading(false);
        return { success: false };
      }

      const data = await response.json();
      setLoading(false);
      toast.success('Giriş başarılı, yönlendiriliyorsunuz...');
      setTimeout(() => {
        setUser({ id: data.userId });
      }, 1000);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      toast.error('Giriş başarısız, lütfen tekrar deneyin.');
      return { success: false };
    }
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
