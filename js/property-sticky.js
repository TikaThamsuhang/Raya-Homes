// Sticky Filter Bar Background Transition using Sentinel
document.addEventListener("DOMContentLoaded", () => {
  const filterBarContainer = document.querySelector(".filter-bar-container");

  if (filterBarContainer && window.innerWidth <= 767) {
    // Create an invisible sentinel element
    const sentinel = document.createElement("div");
    sentinel.classList.add("sticky-sentinel");
    // Make it invisible but existing in layout
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    sentinel.style.visibility = "hidden";
    sentinel.style.marginBottom = "-1px"; // Compensate for height so it takes 0 visual space

    // Insert it right before the filter bar
    filterBarContainer.parentNode.insertBefore(sentinel, filterBarContainer);

    // Setup Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // If the sentinal has scrolled out of view to the top (is not intersecting and top < 0)
        // Then the filter bar following it must be sticky at the top
        // Used slightly negative logic to ensure it catches strictly
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          filterBarContainer.classList.add("stuck");
        } else {
          filterBarContainer.classList.remove("stuck");
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(sentinel);
  }
});
