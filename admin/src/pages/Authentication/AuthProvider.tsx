import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  signin: (username: string, password: string) => Promise<{ success: boolean }>;
  signout: () => void;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = `${import.meta.env.VITE_APP_API_URL}/signin`;

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signin = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean }> => {
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
        return { success: false };
      }

      toast.success('Giriş başarılı, yönlendiriliyorsunuz...');
      const data = await response.json();

      setTimeout(() => {
        setUser({ id: data.userId });
        localStorage.setItem('user', JSON.stringify({ id: data.userId }));
        navigate('/');
        toast.dismiss();
      }, 1000);

      return { success: true };
    } catch (err: any) {
      toast.error('Giriş başarısız, lütfen tekrar deneyin.');
      return { success: false };
    }
  };

  const signout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <span>Çıkış yapılsın mı?</span>
          <div className="flex gap-2 justify-end">
            <button
              className="p-2 bg-gray-600 text-white text-[15px] rounded min-w-25"
              onClick={() => toast.dismiss(t.id)}
            >
              Vazgeç
            </button>
            <button
              className="p-2 bg-danger text-white text-[15px] rounded min-w-25"
              onClick={() => {
                setUser(null);
                localStorage.removeItem('user');
                navigate('/giris-yap');
                toast.dismiss(t.id);
              }}
            >
              Çıkış yap
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
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
