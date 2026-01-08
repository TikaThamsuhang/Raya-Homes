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
          currentAddress.substring(0, currentCharIndex + 1)
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
          currentAddress.substring(0, currentCharIndex - 1)
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
});
