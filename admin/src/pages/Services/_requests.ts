const API_URL = import.meta.env.VITE_APP_API_URL + '/services';

export const getAllServices = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((service: Service) => ({
      ...service,
      images: service.images,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return error;
  }
};

export const addNewService = async (newService: NewService) => {
  if (!newService.images || newService.images.length === 0) {
    return Promise.reject('En az bir görsel yüklemek zorunludur');
  }

  const formData = new FormData();
  formData.append('title', newService.title);
  formData.append('description', newService.description);
  formData.append('advantages', JSON.stringify(newService.advantages));
  formData.append('htmlContent', newService.htmlContent);

  newService.images.forEach((image: any) => {
    formData.append('images', image);
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        'Hizmet eklenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
      );
    }

    return 'Hizmet eklendi';
  } catch (error) {
    throw new Error(
      'Hizmet eklenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
    );
  }
};

export const removeServiceById = async (serviceId: string) => {
  try {
    const response = await fetch(API_URL + `/${serviceId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(
        'Hizmet silinirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
      );
    }

    return 'Hizmet silindi';
  } catch (error) {
    throw new Error(
      'Hizmet silinirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
    );
  }
};

export const editServiceById = async (updatedService: EditedService) => {
  const formData = new FormData();
  formData.append('title', updatedService.title);
  formData.append('description', updatedService.description);
  formData.append('advantages', JSON.stringify(updatedService.advantages));
  formData.append('htmlContent', updatedService.htmlContent);

  updatedService.images.forEach((image: any) => {
    if (image instanceof File) {
      formData.append('images', image);
    }
  });

  formData.append(
    'existingImages',
    JSON.stringify(
      updatedService.images.filter((image: any) => typeof image === 'string'),
    ),
  );

  try {
    const response = await fetch(API_URL + `/${updatedService.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        'Hizmet güncellenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
      );
    }

    return 'Hizmet güncellendi';
  } catch (error) {
    throw new Error(
      'Hizmet güncellenirken bir hata oluştu, lütfen daha sonra tekrar deneyin',
    );
  }
};
