document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('[data-carousel]');

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-dot]'));
  const status = carousel.querySelector('[data-carousel-status]');
  const caption = carousel.querySelector('[data-carousel-caption]');
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');

  if (!track || slides.length === 0 || !status || !caption || !prevButton || !nextButton) {
    return;
  }

  let currentIndex = 0;
  let timerId = null;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    carousel.style.setProperty('--carousel-accent', slides[currentIndex].dataset.accent || '#78dbff');
    status.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    caption.textContent = slides[currentIndex].dataset.caption || '';

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.classList.toggle('is-active', isActive);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentIndex);
      dot.setAttribute('aria-current', dotIndex === currentIndex ? 'true' : 'false');
    });
  };

  const stopAutoPlay = () => {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };

  const startAutoPlay = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || timerId !== null) {
      return;
    }

    timerId = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 6500);
  };

  prevButton.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    stopAutoPlay();
    startAutoPlay();
  });

  nextButton.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    stopAutoPlay();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  carousel.addEventListener('pointerenter', stopAutoPlay);
  carousel.addEventListener('pointerleave', startAutoPlay);
  carousel.addEventListener('focusin', stopAutoPlay);
  carousel.addEventListener('focusout', startAutoPlay);

  showSlide(0);
  startAutoPlay();
});
