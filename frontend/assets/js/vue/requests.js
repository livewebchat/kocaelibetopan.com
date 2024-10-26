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
