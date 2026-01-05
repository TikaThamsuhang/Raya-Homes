document.addEventListener("DOMContentLoaded", () => {
  // --- Search Logic ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const searchForm = document.querySelector(".single-search-form");

  const placeholders = {
    buy: "City, Zip, Address, Property Name",
    sell: "Enter your home address",
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = btn.dataset.tab;
      if (placeholders[mode]) {
        searchInput.placeholder = placeholders[mode];
      }
      searchInput.value = "";
    });
  });

  searchInput.addEventListener("focus", () => {
    searchSuggestions.classList.add("show");
  });

  document.addEventListener("click", (e) => {
    if (
      !searchForm.contains(e.target) &&
      !searchSuggestions.contains(e.target)
    ) {
      searchSuggestions.classList.remove("show");
    }
  });

  const suggestionItems = searchSuggestions.querySelectorAll("li");
  suggestionItems.forEach((item) => {
    item.addEventListener("click", () => {
      searchInput.value = item.textContent.trim().replace(/\s+/g, " ");
      searchSuggestions.classList.remove("show");
    });
  });

  // Handle hero search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      // Check which tab is active
      const activeTab = document.querySelector(".tab-btn.active");
      const mode = activeTab ? activeTab.dataset.tab : "buy";

      if (mode === "sell") {
        // Navigate to home valuation page
        window.location.href = `home-valuation.html?address=${encodeURIComponent(
          searchValue
        )}`;
      } else {
        // Navigate to property listing page
        window.location.href = `property.html?search=${encodeURIComponent(
          searchValue
        )}`;
      }
    }
  });

  // --- Featured Properties (Main Carousel) Logic ---
  const prevBtn = document.querySelector(".nav-arrow.prev");
  const nextBtn = document.querySelector(".nav-arrow.next");
  const track = document.querySelector(".carousel-track");

  const updateActiveState = () => {
    const cards = track.querySelectorAll(".property-card");
    cards.forEach((c) => c.classList.remove("active"));
    if (cards.length >= 2) {
      cards[1].classList.add("active");
    }
  };

  if (prevBtn && nextBtn && track) {
    nextBtn.addEventListener("click", () => {
      const cards = track.querySelectorAll(".property-card");
      if (cards.length > 0) {
        track.appendChild(cards[0]);
        updateActiveState();
      }
    });

    prevBtn.addEventListener("click", () => {
      const cards = track.querySelectorAll(".property-card");
      if (cards.length > 0) {
        track.prepend(cards[cards.length - 1]);
        updateActiveState();
      }
    });
    updateActiveState();
  }

  // --- Mini-Carousels (Smooth Infinite Loop) Logic ---
  const sliders = document.querySelectorAll(".img-slider-container");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".img-slider-track");
    let slides = Array.from(slider.querySelectorAll(".img-slide"));
    const prev = slider.querySelector(".slider-prev");
    const next = slider.querySelector(".slider-next");
    const pagination = slider.querySelector(".slider-pagination");

    const totalSlides = slides.length; // Real count

    // Clone First and Last slides for infinite loop illusion
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);

    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.append(firstClone);
    track.prepend(lastClone);

    // Re-query slides with clones
    const allSlides = track.querySelectorAll(".img-slide");

    let currentIndex = 1; // Start at 1 (because 0 is lastClone)
    let isTransitioning = false;
    let slideInterval;

    // Set initial position
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    pagination.textContent = `1/${totalSlides}`;

    const updatePagination = () => {
      let realIndex = currentIndex;
      if (currentIndex === 0) realIndex = totalSlides;
      if (currentIndex === totalSlides + 1) realIndex = 1;
      pagination.textContent = `${realIndex}/${totalSlides}`;
    };

    const moveSlide = (direction) => {
      if (isTransitioning) return;
      isTransitioning = true;

      track.style.transition = "transform 0.5s ease-in-out";
      if (direction === "next") {
        currentIndex++;
      } else {
        currentIndex--;
      }

      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updatePagination();
    };

    // Handle Transition End (The Jump)
    track.addEventListener("transitionend", () => {
      isTransitioning = false;

      if (allSlides[currentIndex].id === "first-clone") {
        track.style.transition = "none"; // Disable animation
        currentIndex = 1; // Jump to real first slide
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      if (allSlides[currentIndex].id === "last-clone") {
        track.style.transition = "none"; // Disable animation
        currentIndex = totalSlides; // Jump to real last slide
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    });

    // Controls
    next.addEventListener("click", (e) => {
      e.stopPropagation();
      moveSlide("next");
    });

    prev.addEventListener("click", (e) => {
      e.stopPropagation();
      moveSlide("prev");
    });

    // Auto Slide
    const startSlide = () => {
      slideInterval = setInterval(() => {
        moveSlide("next");
      }, 3000);
    };

    const stopSlide = () => {
      clearInterval(slideInterval);
    };

    startSlide();

    slider.addEventListener("mouseenter", stopSlide);
    slider.addEventListener("mouseleave", startSlide);
  });

  // --- Valuation Form Logic ---
  const valuationForm = document.getElementById("valuationForm");
  const valuationInput = document.getElementById("valuationInput");
  const valuationSuggestions = document.getElementById("valuationSuggestions");

  if (valuationForm && valuationInput && valuationSuggestions) {
    // Show suggestions on focus
    valuationInput.addEventListener("focus", () => {
      valuationSuggestions.classList.add("show");
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!valuationForm.contains(e.target)) {
        valuationSuggestions.classList.remove("show");
      }
    });

    // Handle suggestion clicks
    const valuationSuggestionItems =
      valuationSuggestions.querySelectorAll("li");
    valuationSuggestionItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Get text and replace multiple spaces/newlines with single space
        const text = item.textContent.trim().replace(/\s+/g, " ");
        valuationInput.value = text;
        valuationSuggestions.classList.remove("show");
      });
    });

    // Handle form submission
    valuationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const address = valuationInput.value.trim();
      if (address) {
        // Navigate to home-valuation.html with address as URL parameter
        window.location.href = `home-valuation.html?address=${encodeURIComponent(
          address
        )}`;
      }
    });
  }
});
