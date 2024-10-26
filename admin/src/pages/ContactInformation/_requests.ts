const API_URL = import.meta.env.VITE_APP_API_URL + '/hero_sliders';

export const updateContactInformation = async () => {
  try {
    const response = await fetch(API_URL + '/contacts');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return error;
  }
};
