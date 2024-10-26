const initializeSwipers = () => {
  new Swiper(".banner", {
    loop: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    pagination: {
      el: ".banner-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".banner-next-button",
      prevEl: ".banner-prev-button",
    },
  })

  new Swiper(".case-studies-slider", {
    slidesPerView: 3,
    pagination: {
      el: ".case-studies-pagination",
      clickable: true,
    },
  })

  new Swiper(".steps-slider", {
    slidesPerView: 1,
    pagination: {
      el: ".steps-pagination",
      clickable: true,
    },
  })

  new Swiper(".clients-slider", {
    slidesPerView: 1,
    pagination: {
      el: ".clients-pagination",
      clickable: true,
    },
  })
}
