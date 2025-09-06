// Get service ID from URL parameters
function getServiceIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("id")
}

// Fetch service data from API
async function fetchServiceData(serviceId) {
  try {
    // First try the single service endpoint
    try {
      const response = await fetch(
        `https://api.kocaelibetopan.com/services/${serviceId}`
      )
      if (response.ok) {
        return await response.json()
      }
    } catch (e) {
      // If single service endpoint fails, fall back to fetching all services
    }

    // Fallback: fetch all services and filter by ID
    const response = await fetch(`https://api.kocaelibetopan.com/services`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const services = await response.json()

    const service = services.find((s) => s.id == serviceId)
    if (!service) {
      throw new Error(`Service with ID ${serviceId} not found`)
    }
    return service
  } catch (error) {
    console.error("Error fetching service data:", error)
    throw error
  }
}

// Render service images (single image)
function renderServiceImages(images) {
  const imagesContainer = document.getElementById("service-images")
  if (!imagesContainer) return

  if (!images || images.length === 0) {
    imagesContainer.innerHTML =
      '<div class="col mb-2em"><p>Bu hizmet için resim bulunmuyor.</p></div>'
    return
  }

  const serviceTitle = document.getElementById("service-title").textContent
  const image = images[0] // Take only the first image

  const imageHtml = `
    <div class="col mb-2em">
      <img
        src="https://kocaelibetopan.com/uploads/${image}"
        alt="${serviceTitle}"
        class="img-fluid lightbox-trigger"
      />
    </div>
  `

  imagesContainer.innerHTML = imageHtml

  // Add click handler for lightbox
  const imageElement = imagesContainer.querySelector(".lightbox-trigger")
  if (imageElement) {
    imageElement.addEventListener("click", () => {
      openLightbox(imageElement.src)
    })
  }
}

// Open lightbox
function openLightbox(imageSrc) {
  const lightbox = document.getElementById("lightbox")
  const lightboxImage = document.getElementById("lightbox-image")

  lightbox.style.display = "flex"
  lightboxImage.src = imageSrc
}

// Close lightbox
function closeLightbox() {
  const lightbox = document.getElementById("lightbox")
  lightbox.style.display = "none"
}

// Render service content
function renderServiceContent(service) {
  const contentContainer = document.getElementById("service-content")
  if (!contentContainer) return

  let contentHtml = ""

  if (service.htmlContent) {
    // If there's custom HTML content, use it
    contentHtml = service.htmlContent
  } else {
    // Fallback to basic content structure
    contentHtml = `
      <p>${service.description}</p>
    `

    // Add advantages if available
    if (service.advantages) {
      const advantages =
        typeof service.advantages === "string"
          ? JSON.parse(service.advantages)
          : service.advantages

      if (advantages && advantages.length > 0) {
        contentHtml += '<div class="benefits-section mt-2em">'
        advantages.forEach((advantage, index) => {
          contentHtml += `
            <div class="benefit">
              <h5 class="mt-1em font-semibold">
                ${index + 1}. ${advantage.title || advantage}
              </h5>
              <p>${advantage.description || advantage}</p>
            </div>
          `
        })
        contentHtml += "</div>"
      }
    }
  }

  contentContainer.innerHTML = contentHtml
}

// Update page title and meta tags
function updatePageMeta(service) {
  document.title = `${service.title} - Kocaeli Betopan`

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute("content", service.description)
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute("content", service.title)
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  )
  if (ogDescription) {
    ogDescription.setAttribute("content", service.description)
  }
}

// Show error message
function showError(message) {
  const titleElement = document.getElementById("service-title")
  const contentElement = document.getElementById("service-content")
  const imagesElement = document.getElementById("service-images")

  if (titleElement) {
    titleElement.textContent = "Hata"
  }
  if (contentElement) {
    contentElement.innerHTML = `<p style="color: red;">${message}</p>`
  }
  if (imagesElement) {
    imagesElement.innerHTML = ""
  }
}

// Initialize the page
async function initializeServiceDetail() {
  const serviceId = getServiceIdFromUrl()

  if (!serviceId) {
    showError(
      "Hizmet ID bulunamadı. Lütfen geçerli bir hizmet linkini kullanın."
    )
    return
  }

  try {
    const service = await fetchServiceData(serviceId)

    // Update page title
    document.getElementById("service-title").textContent = service.title

    // Update page meta tags
    updatePageMeta(service)

    // Render images
    const images =
      typeof service.images === "string"
        ? JSON.parse(service.images)
        : service.images
    renderServiceImages(images)

    // Render content
    renderServiceContent(service)
  } catch (error) {
    console.error("Error initializing service detail:", error)
    showError(
      "Hizmet verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
    )
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeServiceDetail()

  // Add lightbox close handlers
  document.querySelector(".close").addEventListener("click", closeLightbox)

  document.getElementById("lightbox").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeLightbox()
    }
  })
})
