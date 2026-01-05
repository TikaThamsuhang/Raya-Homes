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
});
