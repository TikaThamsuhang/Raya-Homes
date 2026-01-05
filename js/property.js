// Search Suggestions Logic
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("propertySearchInput");
  const searchSuggestions = document.getElementById(
    "propertySearchSuggestions"
  );

  if (searchInput && searchSuggestions) {
    // Read URL parameter and populate search input
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");
    if (searchQuery) {
      searchInput.value = decodeURIComponent(searchQuery);
    }

    // Show on focus
    searchInput.addEventListener("focus", () => {
      searchSuggestions.classList.add("show");
    });

    // Hide on click outside
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !searchSuggestions.contains(e.target)
      ) {
        searchSuggestions.classList.remove("show");
      }
    });

    // Handle suggestion clicks
    const suggestionItems = searchSuggestions.querySelectorAll("li");
    suggestionItems.forEach((item) => {
      item.addEventListener("click", () => {
        const text = item.textContent.trim().replace(/\s+/g, " ");
        searchInput.value = text;
        searchSuggestions.classList.remove("show");
      });
    });
  }

  // Generic Dropdown Logic
  function setupDropdown(btnId, dropdownId, labelTemplate) {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);

    if (btn && dropdown) {
      // Toggle on button click
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Close other dropdowns first
        document.querySelectorAll(".filter-dropdown").forEach((d) => {
          if (d !== dropdown) d.classList.remove("show");
        });
        dropdown.classList.toggle("show");
      });

      // Prevent closing when clicking inside dropdown
      dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Reset Button
      const resetBtn = dropdown.querySelector(".btn-reset");
      if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          // Uncheck all checkboxes
          const checkboxes = dropdown.querySelectorAll(
            'input[type="checkbox"]'
          );
          checkboxes.forEach((cb) => (cb.checked = false));
          // Update label
          btn.innerHTML = labelTemplate(0);
        });
      }

      // Done Button
      const doneBtn = dropdown.querySelector(".btn-done");
      // Checkboxes change listener for dynamic label updates (optional)
      const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');

      if (doneBtn) {
        doneBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdown.classList.remove("show");

          // Update button text
          const checkedCount = Array.from(checkboxes).filter(
            (cb) => cb.checked
          ).length;
          btn.innerHTML = labelTemplate(checkedCount);
        });
      }
    }
  }

  // Init Dropdowns
  setupDropdown("propertyTypeBtn", "propertyTypeDropdown", (count) => {
    return count > 0
      ? `<i class="fa-solid fa-house"></i> Property Type (${count}) <i class="fa-solid fa-chevron-down"></i>`
      : `<i class="fa-solid fa-house"></i> Property Type <i class="fa-solid fa-chevron-down"></i>`;
  });

  setupDropdown("bedroomsBtn", "bedroomsDropdown", (count) => {
    return count > 0
      ? `<i class="fa-solid fa-bed"></i> Bedrooms (${count}) <i class="fa-solid fa-chevron-down"></i>`
      : `<i class="fa-solid fa-bed"></i> Bedrooms <i class="fa-solid fa-chevron-down"></i>`;
  });

  setupDropdown("bathroomsBtn", "bathroomsDropdown", (count) => {
    return count > 0
      ? `<i class="fa-solid fa-bath"></i> Bathrooms (${count}) <i class="fa-solid fa-chevron-down"></i>`
      : `<i class="fa-solid fa-bath"></i> Bathrooms <i class="fa-solid fa-chevron-down"></i>`;
  });

  // Price Dropdown Logic (Custom)
  const priceBtn = document.getElementById("priceBtn");
  const priceDropdown = document.getElementById("priceDropdown");
  if (priceBtn && priceDropdown) {
    // Toggle Dropdown
    priceBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".filter-dropdown").forEach((d) => {
        if (d !== priceDropdown) d.classList.remove("show");
      });
      priceDropdown.classList.toggle("show");
    });

    priceDropdown.addEventListener("click", (e) => e.stopPropagation());

    // Reset
    const resetBtn = priceDropdown.querySelector(".btn-reset");
    resetBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("minPriceInput").value = "";
      document.getElementById("maxPriceInput").value = "";
      priceBtn.innerHTML = `<i class="fa-solid fa-tag"></i> Price <i class="fa-solid fa-chevron-down"></i>`;
    });

    // Done
    const doneBtn = priceDropdown.querySelector(".btn-done");
    doneBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      priceDropdown.classList.remove("show");
      const min = document.getElementById("minPriceInput").value;
      const max = document.getElementById("maxPriceInput").value;

      if (min && max) {
        priceBtn.innerHTML = `<i class="fa-solid fa-tag"></i> ${min} - ${max} <i class="fa-solid fa-chevron-down"></i>`;
      } else if (min) {
        priceBtn.innerHTML = `<i class="fa-solid fa-tag"></i> ${min}+ <i class="fa-solid fa-chevron-down"></i>`;
      } else if (max) {
        priceBtn.innerHTML = `<i class="fa-solid fa-tag"></i> Up to ${max} <i class="fa-solid fa-chevron-down"></i>`;
      } else {
        priceBtn.innerHTML = `<i class="fa-solid fa-tag"></i> Price <i class="fa-solid fa-chevron-down"></i>`;
      }
    });

    // Input Suggestions Logic
    const setupPriceInput = (inputId, listId) => {
      const input = document.getElementById(inputId);
      const list = document.getElementById(listId);

      if (input && list) {
        input.addEventListener("focus", () => list.classList.add("show"));

        input.addEventListener("blur", () => {
          // Small delay to allow click events to process
          setTimeout(() => list.classList.remove("show"), 200);
        });

        // Select suggestion
        list.querySelectorAll("li").forEach((item) => {
          // Use mousedown to trigger before blur
          item.addEventListener("mousedown", (e) => {
            e.preventDefault(); // Prevent focus loss
            const val = item.getAttribute("data-value");
            input.value = val === "any" ? "" : item.textContent;
            list.classList.remove("show");
          });
        });
      }
    };

    setupPriceInput("minPriceInput", "minPriceSuggestions");
    setupPriceInput("maxPriceInput", "maxPriceSuggestions");
  }

  // More Dropdown Setup
  setupDropdown("moreBtn", "moreDropdown", (count) => {
    return count > 0
      ? `More (${count}) <i class="fa-solid fa-chevron-down"></i>`
      : `More <i class="fa-solid fa-chevron-down"></i>`;
  });

  // Close all dropdowns on click outside
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-dropdown")
      .forEach((d) => d.classList.remove("show"));
    // Close sort dropdown
    document.getElementById("sortDropdown")?.classList.remove("show");
  });

  // Sort Dropdown Logic
  const sortTrigger = document.getElementById("sortTrigger");
  const sortDropdown = document.getElementById("sortDropdown");
  const currentSort = document.getElementById("currentSort");

  if (sortTrigger && sortDropdown) {
    sortTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      sortDropdown.classList.toggle("show");
    });

    sortDropdown.querySelectorAll(".sort-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        // Update active state
        sortDropdown
          .querySelectorAll(".sort-option")
          .forEach((o) => o.classList.remove("active"));
        option.classList.add("active");

        // Update text
        if (currentSort) currentSort.textContent = option.textContent;

        // Close dropdown
        sortDropdown.classList.remove("show");

        // Optional: Trigger sort logic here
        console.log("Sorted by:", option.dataset.value);
      });
    });
  }

  // Image Slider Logic
  document.querySelectorAll(".listing-card").forEach((card) => {
    const images = card.querySelectorAll(".image-slider img");
    const counter = card.querySelector(".slider-counter");
    const prevBtn = card.querySelector(".slider-btn.prev");
    const nextBtn = card.querySelector(".slider-btn.next");

    let currentIndex = 0;
    const totalImages = images.length;

    if (totalImages > 0) {
      // Update initial counter
      if (counter) counter.textContent = `1/${totalImages}`;

      const updateSlider = () => {
        // Update images
        images.forEach((img, index) => {
          img.classList.toggle("active", index === currentIndex);
        });
        // Update counter
        if (counter) counter.textContent = `${currentIndex + 1}/${totalImages}`;
      };

      if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent link nav if card is a link
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

  // Card Click Redirect Logic
  document.querySelectorAll(".listing-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // Ignore clicks on buttons or links (prev/next, fav, email agent)
      if (e.target.closest("button") || e.target.closest("a")) {
        return;
      }
      window.location.href = "property-detail.html";
    });
  });

  // Contact Form Overlay Logic
  const contactOverlay = document.getElementById("contactOverlay");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const emailAgentBtns = document.querySelectorAll(".email-agent-btn");

  // Open overlay when any "Email Agent" button is clicked
  emailAgentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      contactOverlay.classList.add("show");
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    });
  });

  // Function to close overlay
  const closeOverlay = () => {
    contactOverlay.classList.remove("show");
    // Restore body scroll
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  // Close overlay when close button is clicked
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeOverlay);
  }

  // Close overlay when clicking on backdrop
  if (contactOverlay) {
    contactOverlay.addEventListener("click", (e) => {
      if (e.target === contactOverlay) {
        closeOverlay();
      }
    });
  }

  // Close overlay on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contactOverlay.classList.contains("show")) {
      closeOverlay();
    }
  });

  // Handle form submission (prevent default for now)
  const contactForm = contactOverlay?.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Add your form submission logic here
      console.log("Form submitted");
      // Close overlay after submission
      closeOverlay();
    });
  }

  // Save Search Modal Logic
  const saveSearchBtn = document.getElementById("saveSearchBtn");
  const saveSearchOverlay = document.getElementById("saveSearchOverlay");
  const cancelSaveSearchBtn = document.getElementById("cancelSaveSearchBtn");
  const confirmSaveSearchBtn = document.getElementById("confirmSaveSearchBtn");
  const searchNameInput = document.getElementById("searchNameInput");
  let isFirstSave = true;

  if (saveSearchBtn && saveSearchOverlay) {
    // Open Modal
    saveSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      searchNameInput.value = "address and price entered"; // Reset/Pre-fill
      saveSearchOverlay.classList.add("show");
      document.body.style.overflow = "hidden"; // Prevent scroll
    });

    // Close Modal Function
    const closeSaveSearch = () => {
      saveSearchOverlay.classList.remove("show");
      document.body.style.overflow = ""; // Restore scroll
    };

    // Cancel Button
    if (cancelSaveSearchBtn) {
      cancelSaveSearchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeSaveSearch();
      });
    }

    // Toast Logic
    const saveToast = document.getElementById("saveToast");
    const toastMessage = document.getElementById("toastMessage");

    const showToast = (message) => {
      if (saveToast && toastMessage) {
        toastMessage.textContent = message;
        saveToast.classList.add("show");
        setTimeout(() => {
          saveToast.classList.remove("show");
        }, 3000);
      }
    };

    // Confirm Save
    if (confirmSaveSearchBtn) {
      confirmSaveSearchBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (isFirstSave) {
          showToast("Search saved successfully!");
          isFirstSave = false;
        } else {
          showToast("Search updated!");
        }

        closeSaveSearch();
      });
    }

    // Close on Backdrop Click
    saveSearchOverlay.addEventListener("click", (e) => {
      if (e.target === saveSearchOverlay) {
        closeSaveSearch();
      }
    });
  }
});
