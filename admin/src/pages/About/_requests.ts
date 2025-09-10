import { AboutPage } from './_models';

const API_URL = 'https://api.kocaelibetopan.com';

export const getAboutPage = async (): Promise<AboutPage> => {
  const response = await fetch(`${API_URL}/about`);
  
  if (!response.ok) {
    throw new Error('Hakkımızda sayfası getirilirken hata oluştu');
  }
  
  return response.json();
};

export const updateAboutPage = async (aboutData: { title: string; content: string }): Promise<string> => {
  const response = await fetch(`${API_URL}/about`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aboutData),
  });

  if (!response.ok) {
    throw new Error('Hakkımızda sayfası güncellenirken hata oluştu');
  }

  const result = await response.json();
  return result.message;
};