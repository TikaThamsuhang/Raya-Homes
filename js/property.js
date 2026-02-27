// Search Suggestions Logic
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("propertySearchInput");
  const searchSuggestions = document.getElementById("propertySearchSuggestions");

  if (searchInput && searchSuggestions) {
    // Read URL parameter and populate search input (if any)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");
    if (searchQuery) {
      searchInput.value = decodeURIComponent(searchQuery);
    }

    // Load property data for suggestions
    let properties = [];
    try {
      const response = await fetch("js/properties-data.json");
      if (response.ok) {
        properties = await response.json();
      }
    } catch (err) {
      console.error("Failed to load properties for search suggestions:", err);
    }

    // Function to render dynamic suggestions
    const renderSuggestions = (query) => {
      searchSuggestions.innerHTML = ""; // clear current
      
      let matches = [];
      let groupTitle = "";

      if (!query) {
        // If query is empty, show 3 popular/featured properties
        let popular = properties.filter(p => p.featured === true);
        if (popular.length < 3) {
          popular = properties.slice(0, 3);
        }
        matches = popular.slice(0, 3);
        groupTitle = "Popular Properties";
      } else {
        // Show matching properties
        const lowerQuery = query.toLowerCase();
        matches = properties.filter(p => 
          p.title.toLowerCase().includes(lowerQuery) ||
          p.address.toLowerCase().includes(lowerQuery) ||
          (p.location && p.location.toLowerCase().includes(lowerQuery))
        );
        groupTitle = "Matching Properties";
      }

      if (matches.length === 0) {
        if (query) {
          searchSuggestions.innerHTML = `
            <div class="suggestion-group">
              <h6 style="color:red;">No properties found for "${query}"</h6>
            </div>
          `;
          searchSuggestions.classList.add("show");
        } else {
          searchSuggestions.classList.remove("show");
        }
        return;
      }

      // Build the suggestion HTML
      const groupDiv = document.createElement("div");
      groupDiv.className = "suggestion-group";
      groupDiv.innerHTML = `<h6>${groupTitle}</h6>`;
      
      const ul = document.createElement("ul");
      matches.slice(0, 8).forEach(prop => { // limit to 8 suggestions if matching
        const li = document.createElement("li");
        li.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
            <img src="${prop.photos[0]}" alt="${prop.title}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
            <div style="display:flex; flex-direction:column; line-height:1.2;">
              <span style="font-weight:600; color:var(--color-dark);">${prop.title}</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">${prop.location}</span>
            </div>
          </div>
        `;
        // Navigate on click
        li.addEventListener("click", () => {
          window.location.href = `property-detail.html?id=${prop.slug}`;
        });
        li.style.cursor = "pointer";
        ul.appendChild(li);
      });

      groupDiv.appendChild(ul);
      searchSuggestions.appendChild(groupDiv);
      searchSuggestions.classList.add("show");
    };

    // Listen for typing
    searchInput.addEventListener("input", (e) => {
      renderSuggestions(e.target.value.trim());
    });

    // Show suggestions when focusing on input, whether it has text (matching) or is empty (popular)
    searchInput.addEventListener("focus", (e) => {
      renderSuggestions(e.target.value.trim());
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

    // Handle enter key to redirect to first result or just search page
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          const match = properties.find(p => p.title.toLowerCase().includes(query) || p.address.toLowerCase().includes(query));
          if (match) {
            window.location.href = `property-detail.html?id=${match.slug}`;
          }
        }
      }
    });
    
    const searchBtn = document.querySelector(".search-icon-btn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          const match = properties.find(p => p.title.toLowerCase().includes(query) || p.address.toLowerCase().includes(query));
          if (match) {
            window.location.href = `property-detail.html?id=${match.slug}`;
          }
        }
      });
    }

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
            'input[type="checkbox"]',
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
            (cb) => cb.checked,
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

  // Image Slider & Card Click Redirect Logic (Exposed Globally)
  window.initSliders = () => {
    document
      .querySelectorAll(".listing-card:not(.slider-initialized)")
      .forEach((card) => {
        card.classList.add("slider-initialized");

        // --- Slider Logic ---
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
            if (counter)
              counter.textContent = `${currentIndex + 1}/${totalImages}`;
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

        // --- Card Click Redirect Logic ---
        card.style.cursor = "pointer";
        card.addEventListener("click", (e) => {
          // Ignore clicks on buttons or links (prev/next, fav, email agent)
          if (e.target.closest("button") || e.target.closest("a")) {
            return;
          }

          // Try to find the view-detail link inside the card
          const detailLink =
            card.querySelector(".view-detail-link") ||
            card.querySelector("a[href*='property-detail.html']");
          if (detailLink) {
            window.location.href = detailLink.getAttribute("href");
          } else {
            window.location.href = "property-detail.html";
          }
        });
      });
  };

  // Run once on load for any hardcoded cards
  window.initSliders();

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
});
