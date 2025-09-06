import { ContactMessage, ContactMessageUpdate } from './_models';

const API_URL = import.meta.env.VITE_APP_API_URL + '/contact-messages';

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw error;
  }
};

export const getContactMessage = async (id: number): Promise<ContactMessage> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contact message:', error);
    throw error;
  }
};

export const updateContactMessage = async (
  id: number, 
  updateData: ContactMessageUpdate
): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error updating contact message:', error);
    throw error;
  }
};

export const deleteContactMessage = async (id: number): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw error;
  }
};
