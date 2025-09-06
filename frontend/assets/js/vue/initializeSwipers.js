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
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
  })

  new Swiper(".case-studies-slider", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    loop: true, // Enable infinite loop
    pagination: {
      el: ".case-studies-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        centeredSlides: false,
        spaceBetween: 30,
        loop: false,
      },
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
