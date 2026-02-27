/**
 * property-listings.js
 * ============================================================
 * Drives the property.html listings page.
 * - Fetches all properties from properties-data.json
 * - Dynamically renders property cards into the grid
 * - Hooks into the existing filter UI (type, beds, baths, price, status)
 * - Supports sorting (newest, price asc/desc, featured)
 * - "Contact Agent" button opens the existing contact overlay modal
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ============================================================
  // 1. FETCH PROPERTY DATA FROM JSON
  // ============================================================
  let properties = [];
  try {
    const response = await fetch("js/properties-data.json");
    if (!response.ok) throw new Error("Network response was not ok");
    properties = await response.json();
  } catch (error) {
    console.error("Error loading properties data:", error);
    const grid = document.getElementById("propertyGrid");
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; color:#666;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:2.5rem; color:#f44336; display:block; margin-bottom:1rem;"></i>
          <p>Unable to load property data. Please try again later.</p>
        </div>`;
    }
    return; // Stop execution if data cannot be loaded
  }

  // ============================================================
  // 2. DOM REFERENCES
  // ============================================================
  const grid = document.getElementById("propertyGrid");
  const resultsCountEl = document.querySelector(".listings-meta span strong");
  const currentSortEl = document.getElementById("currentSort");

  // ============================================================
  // 3. STATE — holds the current active filter values
  // ============================================================
  const filters = {
    types: [], // e.g. ["house", "apartment"]
    beds: [], // e.g. ["3", "4"]
    baths: [], // e.g. ["2"]
    statuses: [], // e.g. ["for-sale", "coming-soon"]
    minPrice: null, // e.g. 100000
    maxPrice: null, // e.g. 500000
    search: "", // text search from search bar
  };

  let currentSort = "newest"; // default sort

  // ============================================================
  // 4. HELPER — Format price as "$890,000"
  // ============================================================
  const formatPrice = (price) => "$" + price.toLocaleString("en-US");

  // ============================================================
  // 5. HELPER — Get status badge HTML based on status string
  // ============================================================
  const getStatusTag = (status) => {
    const map = {
      "for-sale": `<span class="status-tag for-sale">For Sale <i class="fa-solid fa-circle-check"></i></span>`,
      "coming-soon": `<span class="status-tag coming-soon">Coming Soon <i class="fa-solid fa-clock"></i></span>`,
      sold: `<span class="status-tag sold">Sold <i class="fa-solid fa-lock"></i></span>`,
      pending: `<span class="status-tag coming-soon">Pending <i class="fa-solid fa-hourglass-half"></i></span>`,
    };
    // Return the matching badge or an empty string if unknown status
    return map[status] || "";
  };

  // ============================================================
  // 6. RENDER — Build and inject property cards into the grid
  // ============================================================
  const renderProperties = (list) => {
    if (!grid) return;
    grid.innerHTML = ""; // Clear existing cards

    if (list.length === 0) {
      // Show empty state message when no results match the filters
      grid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; color:#666;">
          <i class="fa-solid fa-house-circle-xmark" style="font-size:2.5rem; color:#ddd; display:block; margin-bottom:1rem;"></i>
          <p>No properties found matching your search. Try adjusting the filters.</p>
        </div>`;
    } else {
      // Build a card for each property in the filtered/sorted list
      list.forEach((prop) => {
        const card = document.createElement("div");
        card.className = "listing-card";

        // Build the photo slider HTML — each photo becomes an <img> tag
        // The first photo gets the "active" class to be shown by default
        const photosHtml = prop.photos
          .map(
            (src, i) =>
              `<img src="${src}" alt="${prop.title}" class="${i === 0 ? "active" : ""}" />`,
          )
          .join("");

        card.innerHTML = `
          <div class="card-image-wrapper">
            <div class="image-slider">
              ${photosHtml}
            </div>
            <!-- Prev / Next slider buttons (handled by existing property.js) -->
            <button class="slider-btn prev"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="slider-btn next"><i class="fa-solid fa-chevron-right"></i></button>
            <!-- Photo counter, e.g. "1/3" -->
            <div class="slider-counter">1/${prop.photos.length}</div>
            <!-- Listing status badge (For Sale, Coming Soon, etc.) -->
            ${getStatusTag(prop.status)}
          </div>
          <div class="card-content">
            <div class="d-flex justify-between align-center mb-1">
              <h3 class="card-price">${formatPrice(prop.price)}</h3>
            </div>
            <div class="card-specs">
              ${prop.beds} Beds &nbsp; ${prop.baths} Baths &nbsp; ${prop.sqft.toLocaleString()} Sq. Ft. |
              <strong>${prop.facts.propertyType}</strong>
            </div>
            <div class="card-address">${prop.address}</div>
            <div class="d-flex justify-between align-center">
              <!-- Opens the contact overlay modal with this property's agent info pre-filled -->
              <a href="#" class="email-agent-btn"
                onclick="openContactOverlay('${prop.agent.name}', '${prop.address}'); return false;">
                Contact Agent
              </a>
              <!-- Navigate to the detail page, passing the property slug as ?id= -->
              <a href="property-detail.html?id=${prop.slug}" class="view-detail-link" style="font-size:0.9rem; color:var(--color-primary); margin-left:auto; text-decoration:underline;">
                View Details
              </a>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    }

    // Update the results count shown in the listings header (e.g. "6 Homes found")
    if (resultsCountEl) {
      resultsCountEl.textContent = list.length;
    }

    // Re-initialize the image sliders for the newly rendered cards
    // This calls the slider init from property.js which handles prev/next buttons
    if (typeof initSliders === "function") initSliders();
  };

  // ============================================================
  // 7. FILTER + SORT LOGIC
  // ============================================================
  const applyFiltersAndSort = () => {
    let result = [...properties]; // Start with all properties

    // --- TEXT SEARCH: match address or title ---
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.address.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    // --- PROPERTY TYPE filter (e.g. house, apartment, condo) ---
    if (filters.types.length > 0) {
      result = result.filter((p) => filters.types.includes(p.type));
    }

    // --- BEDROOMS filter: "3" means 3+ bedrooms ---
    if (filters.beds.length > 0 && !filters.beds.includes("any")) {
      const minBeds = Math.min(...filters.beds.map(Number));
      result = result.filter((p) => p.beds >= minBeds);
    }

    // --- BATHROOMS filter: "2" means 2+ bathrooms ---
    if (filters.baths.length > 0 && !filters.baths.includes("any")) {
      const minBaths = Math.min(...filters.baths.map(Number));
      result = result.filter((p) => p.baths >= minBaths);
    }

    // --- LISTING STATUS filter (for-sale, pending, sold, new) ---
    if (filters.statuses.length > 0) {
      result = result.filter((p) => filters.statuses.includes(p.status));
    }

    // --- PRICE RANGE filter ---
    if (filters.minPrice !== null) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    // --- SORT the filtered results ---
    switch (currentSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "featured":
        // Featured=true properties come first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "newest":
      default:
        // Most recently listed first based on listingDate
        result.sort(
          (a, b) => new Date(b.listingDate) - new Date(a.listingDate),
        );
        break;
    }

    renderProperties(result);
  };

  // ============================================================
  // 8. WIRE UP FILTER UI — read checkbox states from the DOM
  // ============================================================

  // Helper: collect all checked values for a given checkbox name attribute
  const getCheckedValues = (name) =>
    [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
      (el) => el.value,
    );

  // Reads the current state of all filter checkboxes and updates the filters object
  const syncFilters = () => {
    filters.types = getCheckedValues("type");
    filters.beds = getCheckedValues("beds");
    filters.baths = getCheckedValues("baths");
    filters.statuses = getCheckedValues("status");
  };

  // Attach change listeners to all filter checkboxes
  document
    .querySelectorAll(
      'input[name="type"], input[name="beds"], input[name="baths"], input[name="status"]',
    )
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        syncFilters();
        applyFiltersAndSort();
      });
    });

  // ============================================================
  // 9. WIRE UP PRICE FILTER
  // ============================================================
  const minPriceInput = document.getElementById("minPriceInput");
  const maxPriceInput = document.getElementById("maxPriceInput");
  const minPriceSuggestions = document.getElementById("minPriceSuggestions");
  const maxPriceSuggestions = document.getElementById("maxPriceSuggestions");

  // When a price suggestion list item is clicked, set the input value and filter
  if (minPriceSuggestions) {
    minPriceSuggestions.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const val = li.dataset.value;
        if (minPriceInput) minPriceInput.value = li.textContent;
        // "0" means no minimum
        filters.minPrice = val === "0" ? null : parseInt(val);
        applyFiltersAndSort();
      });
    });
  }
  if (maxPriceSuggestions) {
    maxPriceSuggestions.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const val = li.dataset.value;
        if (maxPriceInput) maxPriceInput.value = li.textContent;
        // "any" means no maximum
        filters.maxPrice = val === "any" ? null : parseInt(val);
        applyFiltersAndSort();
      });
    });
  }

  // Also handle the mobile price filter (same price suggestion lists, different IDs)
  const minPriceMobile = document.getElementById("minPriceSuggestionsMobile");
  const maxPriceMobile = document.getElementById("maxPriceSuggestionsMobile");
  if (minPriceMobile) {
    minPriceMobile.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const val = li.dataset.value;
        filters.minPrice = val === "0" ? null : parseInt(val);
        applyFiltersAndSort();
      });
    });
  }
  if (maxPriceMobile) {
    maxPriceMobile.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const val = li.dataset.value;
        filters.maxPrice = val === "any" ? null : parseInt(val);
        applyFiltersAndSort();
      });
    });
  }

  // ============================================================
  // 10. WIRE UP SEARCH BAR
  // ============================================================
  const searchInput = document.getElementById("propertySearchInput");
  const searchBtn = document.querySelector(".search-icon-btn");

  if (searchInput) {
    // Filter on every keystroke as user types
    searchInput.addEventListener("input", () => {
      filters.search = searchInput.value.trim();
      applyFiltersAndSort();
    });
    // Also filter when Enter key is pressed
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") applyFiltersAndSort();
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      filters.search = searchInput?.value.trim() || "";
      applyFiltersAndSort();
    });
  }

  // ============================================================
  // 11. WIRE UP SORT DROPDOWN
  // ============================================================
  document.querySelectorAll(".sort-option").forEach((option) => {
    option.addEventListener("click", () => {
      currentSort = option.dataset.value;

      // Update the visible label showing the current sort
      if (currentSortEl) currentSortEl.textContent = option.textContent.trim();

      // Mark only the clicked option as active
      document
        .querySelectorAll(".sort-option")
        .forEach((o) => o.classList.remove("active"));
      option.classList.add("active");

      // Close the dropdown
      const dropdown = document.getElementById("sortDropdown");
      if (dropdown) dropdown.classList.remove("show");

      applyFiltersAndSort();
    });
  });

  // ============================================================
  // 12. WIRE UP FILTER RESET BUTTONS (inside dropdowns)
  // ============================================================
  document.querySelectorAll(".btn-reset").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Uncheck all checkboxes inside the nearest dropdown
      btn
        .closest(".filter-dropdown, .filter-section")
        ?.querySelectorAll("input[type='checkbox']")
        .forEach((cb) => (cb.checked = false));

      // Reset price inputs
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      filters.minPrice = null;
      filters.maxPrice = null;

      syncFilters();
      applyFiltersAndSort();
    });
  });

  // ============================================================
  // 13. CONTACT OVERLAY — open with agent name and property address
  // ============================================================
  // This function is called via onclick on each card's "Contact Agent" button
  // It bridges into the existing contact overlay already present in property.html
  window.openContactOverlay = (agentName, propertyAddress) => {
    // Pre-fill the message textarea with the property address
    const msgField = document.getElementById("contactMsg");
    if (msgField)
      msgField.value = `Hi, I would like to know more about ${propertyAddress}`;

    // Show the overlay
    const overlay = document.getElementById("contactOverlay");
    if (overlay) overlay.classList.add("show");
  };

  // ============================================================
  // 14. INITIAL RENDER — show all properties on page load
  // ============================================================
  applyFiltersAndSort();
});
