const fetchSliders = async (sliders, error) => {
  try {
    sliders.value = await getAllSliders()
  } catch (err) {
    error.value = err.message
  }
}
