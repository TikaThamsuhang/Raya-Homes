document.addEventListener("DOMContentLoaded", () => {
  // --- Search Logic ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const searchForm = document.querySelector(".single-search-form");

  const placeholders = {
    location: "City, Zip, Address, Property Name",
    agent: "Enter Agent Name",
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
