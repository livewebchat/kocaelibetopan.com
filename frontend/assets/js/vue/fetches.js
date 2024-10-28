const fetchSliders = async (sliders, error) => {
  try {
    sliders.value = await getAllSliders()
  } catch (err) {
    error.value = err.message
  }
}

const fetchPreviousProjects = async (projects, error) => {
  try {
    projects.value = await getAllPreviousProjects()
  } catch (err) {
    error.value = err.message
  }
}

const fetchServices = async (projects, error) => {
  try {
    projects.value = await getAllServices()
  } catch (err) {
    error.value = err.message
  }
}

const fetchContacts = async (contacts, error) => {
  try {
    contacts.value = await getContacts()
  } catch (err) {
    error.value = err.message
  }
}
