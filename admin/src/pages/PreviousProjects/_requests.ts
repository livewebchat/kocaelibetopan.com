const API_URL = import.meta.env.VITE_APP_API_URL + '/previous_projects';

export const getAllProjects = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.map((project: PreviousProject) => ({
      ...project,
      images: project.images,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return error;
  }
};

export const addNewProject = async (newProject: PreviousProject) => {
  if (!newProject.images || newProject.images.length === 0) {
    return Promise.reject('At least one image is required.');
  }

  const formData = new FormData();
  formData.append('title', newProject.title);
  formData.append('description', newProject.description);

  formData.append('htmlContent', newProject.htmlContent.outerHTML);

  newProject.images.forEach((image) => {
    const blob = new Blob([image], { type: 'image/*' });
    formData.append('images', blob);
  });

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        'An error occurred while adding the project, please try again later',
      );
    }

    return 'Project added';
  } catch (error) {
    throw new Error(
      'An error occurred while adding the project, please try again later',
    );
  }
};

export const removeProjectById = async (projectId: string) => {
  try {
    const response = await fetch(API_URL + `/${projectId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(
        'An error occurred while deleting the project, please try again later',
      );
    }

    return 'Project deleted';
  } catch (error) {
    throw new Error(
      'An error occurred while deleting the project, please try again later',
    );
  }
};

export const editProjectById = async (updatedProject: PreviousProject) => {
  const formData = new FormData();
  formData.append('title', updatedProject.title);
  formData.append('description', updatedProject.description);

  formData.append('htmlContent', updatedProject.htmlContent.outerHTML);

  if (updatedProject.images && updatedProject.images.length > 0) {
    updatedProject.images.forEach((image) => {
      const blob = new Blob([image], { type: 'image/*' });
      formData.append('images', blob);
    });
  }

  try {
    const response = await fetch(API_URL + `/${updatedProject.id}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        'An error occurred while updating the project, please try again later',
      );
    }

    return 'Project updated';
  } catch (error) {
    throw new Error(
      'An error occurred while updating the project, please try again later',
    );
  }
};
