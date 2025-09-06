const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

const scripts = [
  "./assets/js/vue/requests.js",
  "./assets/js/vue/fetches.js",
  "./assets/js/vue/initializeSwipers.js",
  "./assets/js/vue/methods.js",
]

Promise.all(scripts.map(loadScript))
  .then(async () => {
    const { createApp, ref, onMounted, watch } = await import(
      "./vue.esm-browser.prod.js"
    )

    const app = createApp({
      setup() {
        const sliders = ref([])
        const projects = ref([])
        const services = ref([])
        const contacts = ref({})
        const loading = ref(true)
        const error = ref(null)

        const formatPhoneNumber = window.formatPhoneNumber || ((phone) => phone)

        const imagesLoaded = () => {
          return new Promise((resolve) => {
            const images = document.querySelectorAll("#app img")
            const imgPromises = Array.from(images).map((img) => {
              return new Promise((resolve) => {
                img.onload = resolve
                img.onerror = resolve
              })
            })
            Promise.all(imgPromises).then(resolve)
          })
        }

        onMounted(async () => {
          // Set a maximum timeout for loading
          const timeoutId = setTimeout(() => {
            console.warn("Loading timeout reached, showing app anyway")
            loading.value = false
          }, 5000) // 5 second timeout

          try {
            // Use Promise.allSettled instead of Promise.all to continue even if some fail
            const results = await Promise.allSettled([
              fetchSliders(sliders, error),
              fetchPreviousProjects(projects, error),
              fetchServices(services, error),
              fetchContacts(contacts, error),
              imagesLoaded(),
            ])

            // Log any failures but don't block the app
            results.forEach((result, index) => {
              if (result.status === "rejected") {
                console.warn(`API call ${index} failed:`, result.reason)
              }
            })

            initializeSwipers()
          } catch (err) {
            console.error("Vue app initialization error:", err)
            error.value = err.message
          } finally {
            clearTimeout(timeoutId)
            loading.value = false
          }
        })

        console.log("loading")

        watch(loading, (isLoading) => {
          const mainPreloader = document.getElementById("main-preloader")
          const appContainer = document.getElementById("app")

          if (!isLoading) {
            console.log("loaded")

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

        return {
          sliders,
          projects,
          services,
          contacts,
          loading,
          error,
          formatPhoneNumber,
        }
      },
    })

    // Expose Vue app globally for project detail script
    window.Vue = app
    window.VueApp = app.mount("#app")
  })
  .catch((error) => {
    console.error("Error loading scripts:", error)
  })
