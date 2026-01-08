document.addEventListener("DOMContentLoaded", () => {
  // --- Search Logic ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const searchForm = document.querySelector(".single-search-form");
  const searchLabel = document.querySelector(".floating-label-search");

  const tabConfig = {
    buy: {
      label: "City, Zip, Address, Property Name",
      placeholders: [
        "Beverly Hills, CA 90210",
        "Luxury Penthouse in Manhattan",
        "Miami Beach Oceanfront Villa",
        "Modern Loft in Downtown LA",
        "Malibu Beachfront Estate",
      ],
    },
    sell: {
      label: "Your Home Address",
      placeholders: [
        "123 Maple Street, Beverly Hills, CA 90210",
        "456 Ocean Drive, Miami Beach, FL 33139",
        "789 Park Avenue, New York, NY 10021",
        "321 Sunset Boulevard, Los Angeles, CA 90028",
        "654 Pine Street, San Francisco, CA 94102",
      ],
    },
  };

  let currentMode = "buy";

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = btn.dataset.tab;
      currentMode = mode;

      // Update label text
      if (searchLabel && tabConfig[mode]) {
        searchLabel.textContent = tabConfig[mode].label;
      }

      // Clear input
      searchInput.value = "";

      // Restart typing animation with new placeholders
      startTypingAnimation();
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

  // --- Recent Searches Logic (Local Storage) ---
  const RECENT_SEARCHES_KEY = "raya_recent_searches";
  const MAX_RECENT_SEARCHES = 3;

  function getRecentSearches() {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  }

  function saveRecentSearch(term) {
    if (!term) return;
    let searches = getRecentSearches();
    searches = searches.filter((s) => s.toLowerCase() !== term.toLowerCase());
    searches.unshift(term);
    if (searches.length > MAX_RECENT_SEARCHES) searches.pop();
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    renderRecentSearches();
  }

  function renderRecentSearches() {
    const groups = searchSuggestions.querySelectorAll(".suggestion-group");
    let recentGroup = null;
    groups.forEach((group) => {
      const h6 = group.querySelector("h6");
      if (h6 && h6.textContent.trim() === "Recent Searches") {
        recentGroup = group;
      }
    });

    if (!recentGroup) return;

    const ul = recentGroup.querySelector("ul");
    ul.innerHTML = "";
    const searches = getRecentSearches();

    if (searches.length === 0) {
      recentGroup.style.display = "none";
      return;
    }

    recentGroup.style.display = "block";
    searches.forEach((term) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${term}`;
      li.addEventListener("click", () => {
        searchInput.value = term;
        searchSuggestions.classList.remove("show");
        saveRecentSearch(term); // Refresh interaction
        // Trigger generic search behavior if needed, or just let form submit handle it if user presses enter
      });
      ul.appendChild(li);
    });
  }

  // Initial Render & Focus
  renderRecentSearches();
  searchInput.addEventListener("focus", () => {
    renderRecentSearches();
    searchSuggestions.classList.add("show");
  });

  const suggestionItems = searchSuggestions.querySelectorAll("li");
  suggestionItems.forEach((item) => {
    item.addEventListener("click", () => {
      const text = item.textContent.trim().replace(/\s+/g, " ");
      searchInput.value = text;
      saveRecentSearch(text); // Save clicked suggestion as recent
      searchSuggestions.classList.remove("show");
    });
  });

  // Handle hero search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      saveRecentSearch(searchValue); // Save on submit
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

  // Typing Animation for Placeholder (Index Page)
  const typingInputHome = document.getElementById("searchInput");
  let currentTermIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;
  let deletingSpeed = 40;
  let pauseBeforeDelete = 2000;
  let pauseBeforeType = 500;
  let typingTimeout = null;

  function typeEffect() {
    // Don't type if input has focus or has value
    if (
      document.activeElement === typingInputHome ||
      typingInputHome.value.trim() !== ""
    ) {
      typingTimeout = setTimeout(typeEffect, 1000);
      return;
    }

    const searchTerms = tabConfig[currentMode].placeholders;
    const currentTerm = searchTerms[currentTermIndex];

    if (!isDeleting) {
      // Typing
      typingInputHome.setAttribute(
        "placeholder",
        currentTerm.substring(0, currentCharIndex + 1)
      );
      currentCharIndex++;

      if (currentCharIndex === currentTerm.length) {
        // Finished typing, pause then start deleting
        isDeleting = true;
        typingTimeout = setTimeout(typeEffect, pauseBeforeDelete);
        return;
      }
    } else {
      // Deleting
      typingInputHome.setAttribute(
        "placeholder",
        currentTerm.substring(0, currentCharIndex - 1)
      );
      currentCharIndex--;

      if (currentCharIndex === 0) {
        // Finished deleting, move to next term
        isDeleting = false;
        currentTermIndex = (currentTermIndex + 1) % searchTerms.length;
        typingTimeout = setTimeout(typeEffect, pauseBeforeType);
        return;
      }
    }

    typingTimeout = setTimeout(
      typeEffect,
      isDeleting ? deletingSpeed : typingSpeed
    );
  }

  function startTypingAnimation() {
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Reset animation state
    currentTermIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;

    // Clear placeholder and start fresh
    typingInputHome.setAttribute("placeholder", "");

    // Start typing animation after a short delay
    typingTimeout = setTimeout(typeEffect, 500);
  }

  // Start initial animation
  if (typingInputHome) {
    startTypingAnimation();
  }

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
