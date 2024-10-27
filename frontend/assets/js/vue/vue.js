const requestsScript = document.createElement("script")
requestsScript.src = "./assets/js/vue/requests.js"

const fetchesScript = document.createElement("script")
fetchesScript.src = "./assets/js/vue/fetches.js"

const initializeSwipersScript = document.createElement("script")
initializeSwipersScript.src = "./assets/js/vue/initializeSwipers.js"

const methodsScript = document.createElement("script")
methodsScript.src = "./assets/js/vue/methods.js"

document.head.appendChild(requestsScript)
document.head.appendChild(fetchesScript)
document.head.appendChild(initializeSwipersScript)
document.head.appendChild(methodsScript)
;(async () => {
  const { createApp, ref, onMounted, watch } = await import(
    "./vue.esm-browser.prod.js"
  )

  createApp({
    setup() {
      const sliders = ref([])
      const contacts = ref({})
      const loading = ref(true)
      const error = ref(null)

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

      return { sliders, contacts, loading, error, formatPhoneNumber }
    },
  }).mount("#app")
})()
