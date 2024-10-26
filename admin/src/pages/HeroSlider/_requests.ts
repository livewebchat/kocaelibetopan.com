const API_URL = import.meta.env.VITE_APP_API_URL + '/hero_sliders';

export const getAllSliders = async () => {
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

export const addNewSlider = async (newSlider: NewSlider) => {
  if (!newSlider.image) {
    return Promise.reject('Bir görsel seçmek zorunludur.');
  }

  const formData = new FormData();
  formData.append('title', newSlider.title);
  formData.append('description', newSlider.description);
  formData.append('image', newSlider.image);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        'Slayt eklenirken bir hata oluştu, lütfen daha sonra tekrar deneyin.',
      );
    }

    return 'Slayt eklendi';
  } catch (error) {
    throw new Error(
      'Slayt eklenirken bir hata oluştu, lütfen daha sonra tekrar deneyin.',
    );
  }
};
