document.addEventListener("DOMContentLoaded", () => {
  const mobileFilterBtn = document.getElementById("mobileFilterBtn");
  const mobileFilterModal = document.getElementById("mobileFilterModal");
  const closeFilterModal = document.getElementById("closeFilterModal");
  const applyFiltersBtn = document.getElementById("applyFiltersBtn");
  const mobileFilterContent = document.querySelector(".mobile-filter-content");
  const mobileFilterReset = document.querySelector(".mobile-filter-reset");

  if (mobileFilterBtn && mobileFilterModal && mobileFilterContent) {
    mobileFilterBtn.addEventListener("click", () => {
      mobileFilterModal.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    const closeModal = () => {
      mobileFilterModal.classList.remove("show");
      document.body.style.overflow = "";
    };

    closeFilterModal?.addEventListener("click", closeModal);
    applyFiltersBtn?.addEventListener("click", closeModal);

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

  // Map/List toggle
  const viewMapBtn = document.getElementById("viewMapBtn");
  const mapColumn = document.querySelector(".map-column");
  const listingsColumn = document.querySelector(".listings-column");

  if (viewMapBtn && mapColumn) {
    viewMapBtn.addEventListener("click", () => {
      const isMapVisible = mapColumn.classList.contains("show");

      if (isMapVisible) {
        mapColumn.classList.remove("show");
        listingsColumn.style.display = "block";
        viewMapBtn.innerHTML =
          '<i class="fa-solid fa-map"></i><span>View Map</span>';
      } else {
        mapColumn.classList.add("show");
        listingsColumn.style.display = "none";
        viewMapBtn.innerHTML =
          '<i class="fa-solid fa-list"></i><span>View List</span>';
      }
    });
  }
});
