const fetchSliders = async (sliders, error) => {
  try {
    sliders.value = await getAllSliders()
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
