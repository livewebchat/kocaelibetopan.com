let mainSwiper = null
let thumbsSwiper = null
let lightboxSwiper = null

// Get project ID from URL parameters
function getProjectIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("id")
}

// Fetch project data from API
async function fetchProjectData(projectId) {
  try {
    // First try the single project endpoint
    try {
      const response = await fetch(
        `https://api.kocaelibetopan.com/previous_projects/${projectId}`
      )
      if (response.ok) {
        return await response.json()
      }
    } catch (e) {
      // If single project endpoint fails, fall back to fetching all projects
    }

    // Fallback: fetch all projects and filter by ID
    const response = await fetch(
      `https://api.kocaelibetopan.com/previous_projects`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const projects = await response.json()

    const project = projects.find((p) => p.id == projectId)
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`)
    }
    return project
  } catch (error) {
    console.error("Error fetching project data:", error)
    throw error
  }
}

// Initialize main swiper
function initializeMainSwiper(images) {
  if (mainSwiper) {
    mainSwiper.destroy(true, true)
  }
  mainSwiper = new Swiper(".project-main-swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".project-swiper-next",
      prevEl: ".project-swiper-prev",
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
  })
}

// Initialize thumbnail swiper
function initializeThumbsSwiper(images) {
  if (thumbsSwiper) {
    thumbsSwiper.destroy(true, true)
  }
  thumbsSwiper = new Swiper(".project-thumbs-swiper", {
    spaceBetween: 10,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
  })

  // Initialize main swiper after thumbs
  setTimeout(() => {
    initializeMainSwiper(images)
  }, 100)
}

// Initialize lightbox swiper
function initializeLightboxSwiper(images, currentIndex = 0) {
  if (lightboxSwiper) {
    lightboxSwiper.destroy(true, true)
  }
  lightboxSwiper = new Swiper(".lightbox-swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".lightbox-next",
      prevEl: ".lightbox-prev",
    },
    initialSlide: currentIndex,
  })
}

// Render project images with swiper
function renderProjectImages(images) {
  const mainWrapper = document.getElementById("main-swiper-wrapper")
  const thumbsWrapper = document.getElementById("thumbs-swiper-wrapper")
  const lightboxWrapper = document.getElementById("lightbox-swiper-wrapper")

  if (!images || images.length === 0) {
    mainWrapper.innerHTML =
      '<div class="swiper-slide"><p>Bu proje için resim bulunmuyor.</p></div>'
    thumbsWrapper.innerHTML = ""
    lightboxWrapper.innerHTML = ""
    return
  }

  const projectTitle = document.getElementById("project-title").textContent

  // Main swiper slides
  const mainSlidesHtml = images
    .map(
      (image, index) => `
      <div class="swiper-slide">
        <img
          src="https://kocaelibetopan.com/uploads/${image}"
          alt="${projectTitle}"
          class="lightbox-trigger"
          data-index="${index}"
        />
      </div>
    `
    )
    .join("")

  // Thumbnail slides
  const thumbsSlidesHtml = images
    .map(
      (image, index) => `
      <div class="swiper-slide">
        <img
          src="https://kocaelibetopan.com/uploads/${image}"
          alt="${projectTitle}"
        />
      </div>
    `
    )
    .join("")

  // Lightbox slides
  const lightboxSlidesHtml = images
    .map(
      (image, index) => `
      <div class="swiper-slide">
        <img
          src="https://kocaelibetopan.com/uploads/${image}"
          alt="${projectTitle}"
        />
      </div>
    `
    )
    .join("")

  mainWrapper.innerHTML = mainSlidesHtml
  thumbsWrapper.innerHTML = thumbsSlidesHtml
  lightboxWrapper.innerHTML = lightboxSlidesHtml

  // Initialize swipers
  initializeThumbsSwiper(images)
  initializeLightboxSwiper(images)

  // Add click handlers for lightbox
  document.querySelectorAll(".lightbox-trigger").forEach((img, index) => {
    img.addEventListener("click", () => {
      openLightbox(index)
    })
  })
}

// Open lightbox
function openLightbox(index) {
  const lightbox = document.getElementById("lightbox")
  lightbox.style.display = "flex"

  // Initialize lightbox swiper with current index
  initializeLightboxSwiper(
    Array.from(document.querySelectorAll(".lightbox-trigger")).map((img) =>
      img.src.replace("https://kocaelibetopan.com/uploads/", "")
    ),
    index
  )
}

// Close lightbox
function closeLightbox() {
  const lightbox = document.getElementById("lightbox")
  lightbox.style.display = "none"
}

// Render project content
function renderProjectContent(project) {
  const contentContainer = document.getElementById("project-content")
  if (!contentContainer) return

  let contentHtml = ""

  if (project.htmlContent) {
    // If there's custom HTML content, use it
    contentHtml = project.htmlContent
  } else {
    // Fallback to basic content structure
    contentHtml = `
      <h4 class="mb-1em font-semibold">${project.title}</h4>
      <p>${project.description}</p>
    `
  }

  contentContainer.innerHTML = contentHtml
}

// Update page title and meta tags
function updatePageMeta(project) {
  document.title = `${project.title} - Kocaeli Betopan`

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute("content", project.description)
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute("content", project.title)
  }

  const ogDescription = document.querySelector(
    'meta[property="og:description"]'
  )
  if (ogDescription) {
    ogDescription.setAttribute("content", project.description)
  }
}

// Show error message
function showError(message) {
  const titleElement = document.getElementById("project-title")
  const contentElement = document.getElementById("project-content")
  const imagesElement = document.getElementById("project-images")

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
async function initializeProjectDetail() {
  const projectId = getProjectIdFromUrl()

  if (!projectId) {
    showError("Proje ID bulunamadı. Lütfen geçerli bir proje linkini kullanın.")
    return
  }

  try {
    const project = await fetchProjectData(projectId)

    // Update page title
    document.getElementById("project-title").textContent = project.title

    // Update page meta tags
    updatePageMeta(project)

    // Render images
    const images =
      typeof project.images === "string"
        ? JSON.parse(project.images)
        : project.images
    renderProjectImages(images)

    // Render content
    renderProjectContent(project)
  } catch (error) {
    console.error("Error initializing project detail:", error)
    showError(
      "Proje verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
    )
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeProjectDetail()

  // Add lightbox close handlers
  document.querySelector(".close").addEventListener("click", closeLightbox)

  document.getElementById("lightbox").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      closeLightbox()
    }
  })
})
