document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".detail-header");

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }

  // Description expand/collapse
  const readMoreBtn = document.querySelector(".read-more-link");
  const descContainer = document.getElementById("descriptionContainer");

  if (readMoreBtn && descContainer) {
    readMoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isExpanded = descContainer.classList.toggle("expanded");

      if (isExpanded) {
        readMoreBtn.innerHTML =
          'Show Less <i class="fa-solid fa-chevron-up"></i>';
      } else {
        readMoreBtn.innerHTML =
          'Continue Reading <i class="fa-solid fa-chevron-down"></i>';
      }
    });
  }

  // New listings carousel
  const track = document.getElementById("newListingsTrack");
  const prevBtn = document.getElementById("nl-prev");
  const nextBtn = document.getElementById("nl-next");

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;

    const updateCarousel = () => {
      const cards = track.querySelectorAll(".carousel-card");
      if (cards.length === 0) return;

      const card = cards[0];
      const cardWidth = card.offsetWidth;

      let moveAmount;
      if (cards.length > 1) {
        moveAmount = cards[1].offsetLeft - cards[0].offsetLeft;
      } else {
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 24;
        moveAmount = cardWidth + gap;
      }

      const totalCards = track.children.length;
      const containerWidth = track.parentElement.offsetWidth;
      const visibleCards = Math.floor(containerWidth / cardWidth);
      const maxIndex = totalCards - visibleCards;

      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = -(currentIndex * moveAmount);
      track.style.transform = `translateX(${translateX}px)`;

      prevBtn.classList.toggle("disabled", currentIndex === 0);
      nextBtn.classList.toggle("disabled", currentIndex >= maxIndex);
    };

    nextBtn.addEventListener("click", () => {
      currentIndex++;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      currentIndex--;
      updateCarousel();
    });

    window.addEventListener("resize", () => {
      updateCarousel();
    });

    setTimeout(updateCarousel, 100);
  }

  // Property card image sliders
  document.querySelectorAll(".listing-card").forEach((card) => {
    const images = card.querySelectorAll(".image-slider img");
    const counter = card.querySelector(".slider-counter");
    const prevBtn = card.querySelector(".slider-btn.prev");
    const nextBtn = card.querySelector(".slider-btn.next");

    let currentIndex = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      if (counter) counter.textContent = `1/${totalImages}`;

      const updateSlider = () => {
        images.forEach((img, index) => {
          img.classList.toggle("active", index === currentIndex);
        });
        if (counter) counter.textContent = `${currentIndex + 1}/${totalImages}`;
      };

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % totalImages;
          updateSlider();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + totalImages) % totalImages;
          updateSlider();
        });
      }
    }
  });

  // Card click navigation
  document.querySelectorAll(".listing-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      window.location.href = "property-detail.html";
    });
  });

  // Gallery
  const galleryImages = [
    "imgs/Single/img-1.png",
    "imgs/Single/img-bed-1.png",
    "imgs/Single/img-wash-1.png",
    "imgs/Single/img-kitchen-1.png",
    "imgs/Single/img-1.png",
    "imgs/Single/img-bed-1.png",
    "imgs/Single/img-wash-1.png",
    "imgs/Single/img-kitchen-1.png",
    "imgs/Single/img-1.png",
    "imgs/Single/img-bed-1.png",
    "imgs/Single/img-wash-1.png",
    "imgs/Single/img-kitchen-1.png",
  ];

  let currentGalleryIndex = 0;
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryMainImage = document.getElementById("galleryMainImage");
  const galleryCounterIndex = document.getElementById("currentImageIndex");
  const galleryCounterTotal = document.getElementById("totalImages");
  const thumbnailStrip = document.getElementById("thumbnailStrip");

  if (galleryCounterTotal)
    galleryCounterTotal.textContent = galleryImages.length;

  window.openGallery = (index = 0) => {
    currentGalleryIndex = index;
    updateGalleryUI();
    if (galleryOverlay) {
      galleryOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  const closeGallery = () => {
    if (galleryOverlay) {
      galleryOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  const updateGalleryUI = () => {
    if (galleryMainImage) {
      galleryMainImage.style.opacity = "0.5";
      setTimeout(() => {
        galleryMainImage.src = galleryImages[currentGalleryIndex];
        galleryMainImage.style.opacity = "1";
      }, 100);
    }

    if (galleryCounterIndex)
      galleryCounterIndex.textContent = currentGalleryIndex + 1;

    renderThumbnails();
    scrollThumbnailIntoView();
  };

  const renderThumbnails = () => {
    if (!thumbnailStrip) return;
    thumbnailStrip.innerHTML = galleryImages
      .map(
        (img, idx) => `
            <div class="thumb ${idx === currentGalleryIndex ? "active" : ""}" 
                 onclick="openGallery(${idx})">
                <img src="${img}" loading="lazy">
            </div>
        `
      )
      .join("");
  };

  const scrollThumbnailIntoView = () => {
    if (!thumbnailStrip) return;
    const activeThumb = thumbnailStrip.children[currentGalleryIndex];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const showNextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateGalleryUI();
  };

  const showPrevImage = () => {
    currentGalleryIndex =
      (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryUI();
  };

  document
    .getElementById("galleryNextBtn")
    ?.addEventListener("click", showNextImage);
  document
    .getElementById("galleryPrevBtn")
    ?.addEventListener("click", showPrevImage);
  document
    .getElementById("closeGalleryBtn")
    ?.addEventListener("click", closeGallery);
  document
    .querySelector(".gallery-backdrop")
    ?.addEventListener("click", closeGallery);

  document.addEventListener("keydown", (e) => {
    if (!galleryOverlay?.classList.contains("active")) return;

    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") showNextImage();
    if (e.key === "ArrowLeft") showPrevImage();
  });

  document
    .querySelector(".btn-see-all")
    ?.addEventListener("click", () => openGallery(0));

  document
    .querySelectorAll(".gallery-main img, .thumb-item img")
    .forEach((img, index) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        let targetIndex = 0;
        if (img.closest(".gallery-thumbnails")) {
          const thumbs = Array.from(
            document.querySelectorAll(".thumb-item img")
          );
          targetIndex = thumbs.indexOf(img) + 1;
        }
        openGallery(targetIndex);
      });
    });

  const photoView = document.getElementById("photoView");
  const mapView = document.getElementById("mapView");
  const galleryFooter = document.querySelector(".gallery-footer");
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tabName = btn.getAttribute("data-tab");
      if (tabName === "map") {
        photoView.classList.add("hidden");
        mapView.classList.remove("hidden");
        if (galleryFooter) galleryFooter.style.display = "none";
      } else {
        mapView.classList.add("hidden");
        photoView.classList.remove("hidden");
        if (galleryFooter) galleryFooter.style.display = "flex";
      }
    });
  });

  const heroPrevBtn = document.getElementById("heroPrevBtn");
  const heroNextBtn = document.getElementById("heroNextBtn");
  const heroCounterIndex = document.getElementById("heroCurrentIndex");
  const heroCounterTotal = document.getElementById("heroTotalCount");
  const heroImage = document.querySelector(".gallery-main img");

  if (heroCounterTotal) heroCounterTotal.textContent = galleryImages.length;

  const updateHeroUI = () => {
    if (heroImage) {
      heroImage.style.opacity = "0.8";
      setTimeout(() => {
        heroImage.src = galleryImages[currentGalleryIndex];
        heroImage.style.opacity = "1";
      }, 100);
    }
    if (heroCounterIndex)
      heroCounterIndex.textContent = currentGalleryIndex + 1;
  };

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIndex =
        (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateHeroUI();
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      updateHeroUI();
    });
  }

  if (heroImage) {
    heroImage.addEventListener("click", () => {
      openGallery(currentGalleryIndex);
    });
  }
});
