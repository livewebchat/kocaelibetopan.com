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

const fetchServices = async (services, error) => {
  try {
    services.value = await getAllServices()
  } catch (err) {
    error.value = err.message
  }
}

const fetchContacts = async (contacts, error) => {
  try {
    const contactsData = await getContacts()
    contacts.value = contactsData
  } catch (err) {
    error.value = err.message
  }
}

const fetchAboutPage = async (aboutPage, error) => {
  try {
    const aboutData = await getAboutPage()
    aboutPage.value = aboutData
  } catch (err) {
    error.value = err.message
  }
}
