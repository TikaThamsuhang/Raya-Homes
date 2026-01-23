document.addEventListener("DOMContentLoaded", () => {
  // Search Suggestions Logic for Sell Page
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");

  if (searchInput && searchSuggestions) {
    // Show suggestions on focus
    searchInput.addEventListener("focus", () => {
      searchSuggestions.classList.add("show");
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      const form = document.querySelector(".single-search-form");
      if (!form.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.classList.remove("show");
      }
    });

    // Handle suggestion clicks
    const suggestionItems = searchSuggestions.querySelectorAll("li");
    suggestionItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Get text and replace multiple spaces/newlines with single space
        const text = item.textContent.trim().replace(/\s+/g, " ");
        searchInput.value = text;
        searchSuggestions.classList.remove("show");
      });
    });
  }

  // Typing Animation for Placeholder
  const typingInput = document.getElementById("searchInput");
  if (typingInput) {
    const addresses = [
      "123 Maple Street, Beverly Hills, CA 90210",
      "456 Ocean Drive, Miami Beach, FL 33139",
      "789 Park Avenue, New York, NY 10021",
      "321 Sunset Boulevard, Los Angeles, CA 90028",
      "654 Pine Street, San Francisco, CA 94102",
    ];

    let currentAddressIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    let deletingSpeed = 40;
    let pauseBeforeDelete = 2000;
    let pauseBeforeType = 500;

    function typeEffect() {
      // Don't type if input has focus or has value
      if (
        document.activeElement === typingInput ||
        typingInput.value.trim() !== ""
      ) {
        setTimeout(typeEffect, 1000);
        return;
      }

      const currentAddress = addresses[currentAddressIndex];

      if (!isDeleting) {
        // Typing
        typingInput.setAttribute(
          "placeholder",
          currentAddress.substring(0, currentCharIndex + 1),
        );
        currentCharIndex++;

        if (currentCharIndex === currentAddress.length) {
          // Finished typing, pause then start deleting
          isDeleting = true;
          setTimeout(typeEffect, pauseBeforeDelete);
          return;
        }
      } else {
        // Deleting
        typingInput.setAttribute(
          "placeholder",
          currentAddress.substring(0, currentCharIndex - 1),
        );
        currentCharIndex--;

        if (currentCharIndex === 0) {
          // Finished deleting, move to next address
          isDeleting = false;
          currentAddressIndex = (currentAddressIndex + 1) % addresses.length;
          setTimeout(typeEffect, pauseBeforeType);
          return;
        }
      }

      setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }

    // Start typing animation after a short delay
    setTimeout(typeEffect, 1000);
  }
  // --- Recent Searches Logic ---
  const RECENT_SEARCHES_KEY = "raya_recent_searches";
  const searchForm = document.querySelector(".single-search-form");

  // Find the UL for recent searches (it's in the second suggestion group)
  // The structure is: searchSuggestions -> div.suggestion-group (Popular) -> div.suggestion-group (Recent) -> ul
  let recentSearchesList = null;
  const suggestionGroups = searchSuggestions
    ? searchSuggestions.querySelectorAll(".suggestion-group")
    : [];
  if (suggestionGroups.length >= 2) {
    recentSearchesList = suggestionGroups[1].querySelector("ul");
  }

  const loadRecentSearches = () => {
    if (!recentSearchesList) return;

    const searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]",
    );
    recentSearchesList.innerHTML = "";

    if (searches.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No recent searches";
      li.style.color = "#999";
      li.style.pointerEvents = "none";
      recentSearchesList.appendChild(li);
      return;
    }

    searches.forEach((term) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${term}`;
      li.addEventListener("click", () => {
        searchInput.value = term;
      });
      recentSearchesList.appendChild(li);
    });
  };

  const saveRecentSearch = (term) => {
    if (!term) return;
    let searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]",
    );

    // Remove if exists
    searches = searches.filter((s) => s.toLowerCase() !== term.toLowerCase());

    // Add to front
    searches.unshift(term);

    // Limit to 5
    if (searches.length > 5) searches.length = 5;

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  };

  // Load on start
  loadRecentSearches();

  // Handle Form Submission (Relocated from inline HTML)
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const address = searchInput.value.trim();

      if (address) {
        saveRecentSearch(address);
        window.location.href =
          "home-valuation.html?address=" + encodeURIComponent(address);
      }
    });
  }
});
