document.addEventListener("DOMContentLoaded", () => {
  const filterBarContainer = document.querySelector(".filter-bar-container");

  if (filterBarContainer && window.innerWidth <= 767) {
    const sentinel = document.createElement("div");
    sentinel.classList.add("sticky-sentinel");
    sentinel.style.height = "1px";
    sentinel.style.width = "100%";
    sentinel.style.visibility = "hidden";
    sentinel.style.marginBottom = "-1px";

    filterBarContainer.parentNode.insertBefore(sentinel, filterBarContainer);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

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
