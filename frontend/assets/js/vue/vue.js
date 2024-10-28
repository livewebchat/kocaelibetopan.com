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

    createApp({
      setup() {
        const sliders = ref([])
        const projects = ref([])
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
          try {
            await Promise.all([
              fetchSliders(sliders, error),
              fetchPreviousProjects(projects, error),
              fetchContacts(contacts, error),
              imagesLoaded(),
            ])

            initializeSwipers()
          } catch (err) {
            error.value = err.message
          } finally {
            loading.value = false
          }
        })

        watch(loading, (isLoading) => {
          const mainPreloader = document.getElementById("main-preloader")
          const appContainer = document.getElementById("app")

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

        return {
          sliders,
          projects,
          contacts,
          loading,
          error,
          formatPhoneNumber,
        }
      },
    }).mount("#app")
  })
  .catch((error) => {
    console.error("Error loading scripts:", error)
  })
