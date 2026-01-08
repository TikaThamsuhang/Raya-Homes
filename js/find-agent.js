document.addEventListener("DOMContentLoaded", () => {
  // --- Search Logic ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const searchForm = document.querySelector(".single-search-form");
  const searchLabel = document.querySelector(".floating-label-search");

  const tabConfig = {
    location: {
      label: "City, Zip, Address, Property Name",
      placeholders: [
        "Beverly Hills, CA",
        "New York, NY 10021",
        "Miami Beach, FL",
        "Los Angeles, CA",
        "San Francisco, CA",
      ],
    },
    agent: {
      label: "Agent Name",
      placeholders: [
        "Sarah Jenkins",
        "Michael Chang",
        "Emily Rodriguez",
        "David Thompson",
        "Jessica Martinez",
      ],
    },
  };

  let currentMode = "location";

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

      // Toggle suggestion groups
      const locationSuggestions = document.querySelector(
        ".location-suggestions"
      );
      const agentSuggestions = document.querySelector(".agent-suggestions");

      if (mode === "location") {
        locationSuggestions.style.display = "block";
        agentSuggestions.style.display = "none";
      } else {
        locationSuggestions.style.display = "none";
        agentSuggestions.style.display = "block";
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
      const mode = activeTab ? activeTab.dataset.tab : "agent";

      if (mode === "agent") {
        // Navigate to home valuation page
        window.location.href = `agent-listings.html?address=${encodeURIComponent(
          searchValue
        )}`;
      } else {
        // Navigate to AGENT LISTINGS page
        window.location.href = `agent-listings.html?search=${encodeURIComponent(
          searchValue
        )}`;
      }
    }
  });

  // Typing Animation for Placeholder (Find Agent Page)
  const typingInputAgent = document.getElementById("searchInput");
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
      document.activeElement === typingInputAgent ||
      typingInputAgent.value.trim() !== ""
    ) {
      typingTimeout = setTimeout(typeEffect, 1000);
      return;
    }

    const searchTerms = tabConfig[currentMode].placeholders;
    const currentTerm = searchTerms[currentTermIndex];

    if (!isDeleting) {
      // Typing
      typingInputAgent.setAttribute(
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
      typingInputAgent.setAttribute(
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
    typingInputAgent.setAttribute("placeholder", "");

    // Start typing animation after a short delay
    typingTimeout = setTimeout(typeEffect, 500);
  }

  // Start initial animation
  if (typingInputAgent) {
    startTypingAnimation();
  }

  /* ==========================================================================
       FUTURE_USE_DIRECTORY_SECTION (Commented out logic)
       ========================================================================== */
  /*
// --- Dynamic Directory Logic ---
  const directoryLinks = document.querySelectorAll(".directory-link");
  const directorySection = document.querySelector(".agent-directory-section");

  // Mock City Data (for demo)
  const cityMockData = [
    "Andalusia, AL",
    "Auburn-Opelika, AL",
    "Bay Minette, AL",
    "Cherokee, AL",
    "Cottonwood, AL",
    "Daphne, AL",
    "Decatur, AL",
    "Dothan, AL",
    "Elba, AL",
    "Enterprise, AL",
    "Eufaula, AL",
    "Fairhope, AL",
    "Florence, AL",
    "Foley, AL",
    "Fort Mitchell, AL",
    "Grand Bay, AL",
    "Gulf Shores, AL",
    "Guntersville, AL",
    "Hartselle, AL",
    "Helena, AL",
    "Homewood, AL",
    "Hoover, AL",
    "Huntsville, AL",
    "Jackson, AL",
    "Jasper, AL",
  ];

  if (directorySection) {
    directoryLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const fullStateText = link.textContent.trim();
        // Extract state name (e.g., "Alabama Real Estate Agents" -> "Alabama")
        const stateName = fullStateText.replace(" Real Estate Agents", "");

        showCityView(stateName);
      });
    });
  }

  function showCityView(stateName) {
    const container = directorySection.querySelector(".app-container");

    // Update Description
    const desc = container.querySelector(".directory-description");
    if (desc)
      desc.innerHTML = `Find Raya Homes affiliated real estate agents in <strong>${stateName}</strong>.`;

    // Update Subheader
    const subheader = container.querySelector(".directory-subheader");
    if (subheader) {
      subheader.textContent = `Real Estate Agents in Popular ${stateName} Cities`;

      // Inject Alpha Nav after subheader
      if (!container.querySelector(".alpha-nav")) {
        const alphaNav = document.createElement("div");
        alphaNav.className = "alpha-nav";
        alphaNav.innerHTML = `
                <span>Browse Cities by Letter</span>
                ${"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  .split("")
                  .map((l) => `<a href="#">${l}</a>`)
                  .join("")}
              `;
        subheader.insertAdjacentElement("afterend", alphaNav);
      }
    }

    // Replace Grid Content
    const grid = container.querySelector(".state-grid");
    if (grid) {
      grid.innerHTML = ""; // Clear States

      // Create 3 columns for cities
      // Distribute mock data
      const itemsPerCol = Math.ceil(cityMockData.length / 3);

      for (let i = 0; i < 3; i++) {
        const col = document.createElement("div");
        col.className = "state-column"; // Reuse class for layout

        const start = i * itemsPerCol;
        const end = start + itemsPerCol;
        const colCities = cityMockData.slice(start, end);

        colCities.forEach((city) => {
          const a = document.createElement("a");
          a.href = "#";
          a.className = "directory-link city-link";
          a.textContent = city;
          col.appendChild(a);
        });

        grid.appendChild(col);
      }
    }

    // Scroll to top of section
    directorySection.scrollIntoView({ behavior: "smooth" });
  }
    */
});
