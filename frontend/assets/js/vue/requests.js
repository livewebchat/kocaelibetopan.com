const API_URL = "https://api.kocaelibetopan.com"

const getAllSliders = async () => {
  try {
    const response = await fetch(API_URL + "/hero_sliders")
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching sliders:", error)
    throw error
  }
}

const getAllPreviousProjects = async () => {
  try {
    const response = await fetch(API_URL + "/previous_projects")
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

const getAllServices = async () => {
  try {
    const response = await fetch(API_URL + "/services")
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching services:", error)
    throw error
  }
}

const getContacts = async () => {
  try {
    const response = await fetch(API_URL + "/contacts")
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error("Error fetching contacts:", error)
    throw error
  }
}
