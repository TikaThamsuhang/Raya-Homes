// Mobile Filter Modal and Action Bar Logic
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Filter Modal
  const mobileFilterBtn = document.getElementById("mobileFilterBtn");
  const mobileFilterModal = document.getElementById("mobileFilterModal");
  const closeFilterModal = document.getElementById("closeFilterModal");
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const mobileFilterContent = document.querySelector(".mobile-filter-content");
  const mobileFilterReset = document.querySelector(".mobile-filter-reset");

  if (mobileFilterBtn && mobileFilterModal && mobileFilterContent) {
    // Populate modal with filters on first open
    let filtersPopulated = false;

    const populateFilters = () => {
      if (filtersPopulated) return;

      // Get all filter dropdowns
      const propertyTypeDropdown = document.getElementById(
        "propertyTypeDropdown"
      );
      const bedroomsDropdown = document.getElementById("bedroomsDropdown");
      const bathroomsDropdown = document.getElementById("bathroomsDropdown");
      const priceDropdown = document.getElementById("priceDropdown");
      const moreDropdown = document.getElementById("moreDropdown");

      // Create filter sections
      const filters = [
        { title: "Property Type", content: propertyTypeDropdown },
        { title: "Bedrooms", content: bedroomsDropdown },
        { title: "Bathrooms", content: bathroomsDropdown },
        { title: "Price Range", content: priceDropdown },
        { title: "More Filters", content: moreDropdown },
      ];

      filters.forEach((filter) => {
        if (filter.content) {
          const section = document.createElement("div");
          section.className = "filter-section";

          const title = document.createElement("h3");
          title.textContent = filter.title;
          section.appendChild(title);

          // Clone the dropdown content
          const dropdownContent =
            filter.content.querySelector(".dropdown-content");
          if (dropdownContent) {
            const clonedContent = dropdownContent.cloneNode(true);
            section.appendChild(clonedContent);
          }

          // For price dropdown, also clone the price inputs
          const priceInputs = filter.content.querySelector(
            ".price-inputs-container"
          );
          if (priceInputs) {
            const clonedInputs = priceInputs.cloneNode(true);
            section.appendChild(clonedInputs);
          }

          // For more filters, clone the entire grid
          const moreGrid = filter.content.querySelector(".more-filters-grid");
          if (moreGrid) {
            const clonedGrid = moreGrid.cloneNode(true);
            section.appendChild(clonedGrid);
          }

          mobileFilterContent.appendChild(section);
        }
      });

      filtersPopulated = true;
    };

    // Open modal
    mobileFilterBtn.addEventListener("click", () => {
      populateFilters(); // Populate on first open
      mobileFilterModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    // Close modal
    const closeModal = () => {
      mobileFilterModal.classList.remove("show");
      document.body.style.overflow = "";
    };

    closeFilterModal?.addEventListener("click", closeModal);
    applyFiltersBtn?.addEventListener("click", closeModal);

    // Reset all filters
    mobileFilterReset?.addEventListener("click", () => {
      const checkboxes = mobileFilterContent.querySelectorAll(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((cb) => (cb.checked = false));

      const textInputs = mobileFilterContent.querySelectorAll(
        'input[type="text"], input[type="number"]'
      );
      textInputs.forEach((input) => (input.value = ""));
    });
  }

  // Mobile Bottom Action Bar - View Map Toggle
  const viewMapBtn = document.getElementById("viewMapBtn");
  const mapColumn = document.querySelector(".map-column");
  const listingsColumn = document.querySelector(".listings-column");

  if (viewMapBtn && mapColumn) {
    viewMapBtn.addEventListener("click", () => {
      const isMapVisible = mapColumn.classList.contains("show");

      if (isMapVisible) {
        // Hide map, show listings
        mapColumn.classList.remove("show");
        listingsColumn.style.display = "block";
        viewMapBtn.innerHTML =
          '<i class="fa-solid fa-map"></i><span>View Map</span>';
      } else {
        // Show map, hide listings
        mapColumn.classList.add("show");
        listingsColumn.style.display = "none";
        viewMapBtn.innerHTML =
          '<i class="fa-solid fa-list"></i><span>View List</span>';
      }
    });
  }

  // Mobile Save Search Button
  const mobileSaveSearchBtn = document.getElementById("mobileSaveSearchBtn");
  const desktopSaveSearchBtn = document.getElementById("saveSearchBtn");

  if (mobileSaveSearchBtn && desktopSaveSearchBtn) {
    mobileSaveSearchBtn.addEventListener("click", () => {
      desktopSaveSearchBtn.click(); // Trigger desktop button logic
    });
  }
});
