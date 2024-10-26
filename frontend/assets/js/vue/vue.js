const { createApp, ref, onMounted } = Vue

createApp({
  setup() {
    const sliders = ref([])
    const loading = ref(true)
    const error = ref(null)

    // Function to fetch sliders
    const fetchSliders = async () => {
      try {
        sliders.value = await getAllSliders()
      } catch (err) {
        error.value = err.message
      }
    }

    // Function to wait for images to load
    const waitForImagesToLoad = () => {
      return new Promise((resolve) => {
        const images = document.querySelectorAll("#app img")
        const imgPromises = Array.from(images).map((img) => {
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        })
        Promise.all(imgPromises).then(resolve) // Resolve when all images are loaded
      })
    }

    // On component mount
    onMounted(async () => {
      try {
        await Promise.all([fetchSliders(), waitForImagesToLoad()])

        const heroSlider = new Swiper(".banner", {
          loop: true,
          pagination: {
            el: ".banner-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".banner-next-button",
            prevEl: ".banner-prev-button",
          },
        })
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

    // Watch for loading status and handle preloader
    this.$watch("loading", (isLoading) => {
      if (!isLoading) {
        setTimeout(() => {
          mainPreloader.addEventListener("transitionend", () => {
            mainPreloader.style.display = "none"
          })

          mainPreloader.style.opacity = "0"
          mainPreloader.style.pointerEvents = "none"
          appContainer.style.display = "block"
        }, 500)
      }
    })
  },
}).mount("#app")
