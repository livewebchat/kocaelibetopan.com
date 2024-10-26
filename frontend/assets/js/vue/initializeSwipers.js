const initializeSwipers = () => {
  const heroSlider = new Swiper(".banner", {
    pagination: {
      el: ".banner-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".banner-next-button",
      prevEl: ".banner-prev-button",
    },
  })

  const caseStudiesSlider = new Swiper(".case-studies-slider", {
    slidesPerView: 3,
    pagination: {
      el: ".case-studies-pagination",
      clickable: true,
    },
  })

  const stepsSlider = new Swiper(".steps-slider", {
    slidesPerView: 1,
    pagination: {
      el: ".steps-pagination",
      clickable: true,
    },
  })

  const clientsSlider = new Swiper(".clients-slider", {
    slidesPerView: 1,
    pagination: {
      el: ".clients-pagination",
      clickable: true,
    },
  })
}
