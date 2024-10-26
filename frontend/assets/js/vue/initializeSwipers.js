const initializeSwipers = () => {
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
}
