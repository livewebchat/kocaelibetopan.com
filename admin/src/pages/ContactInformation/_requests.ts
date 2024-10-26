const API_URL = import.meta.env.VITE_APP_API_URL + '/contacts';

export const getContactInformation = async () => {
  try {
    const response = await fetch(API_URL);
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

export const updateContacts = async (newContacts: Contacts) => {
  try {
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newContacts),
    });

    if (!response.ok) {
      throw new Error(
        'Bilgiler güncellenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
      );
    }

    return 'Bilgiler güncellendi';
  } catch (error) {
    throw new Error(
      'Bilgiler güncellenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
    );
  }
};
