const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const sliders = ref([])
    const loading = ref(true)
    const error = ref(null)

    const fetchSliders = async () => {
      try {
        sliders.value = await getAllSliders()
      } catch (err) {
        error.value = err.message
      }
    }

    onMounted(async () => {
      try {
        await Promise.all([fetchSliders()])
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    })

    return { sliders, loading, error }
  },
  mounted() {
    const mainPreloader = document.getElementById("main-preloader")
    const appContainer = document.getElementById("app")

    this.$watch("loading", (isLoading) => {
      if (!isLoading) {
        setTimeout(() => {
          mainPreloader.style.opacity = "0"

          mainPreloader.addEventListener("transitionend", () => {
            mainPreloader.style.display = "none"
            appContainer.style.opacity = "1"
          })
        }, 500)
      }
    })
  },
}).mount("#app")
