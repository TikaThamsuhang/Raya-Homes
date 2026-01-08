// Scroll to Top Button Functionality
(function () {
  const scrollButton = document.getElementById("scrollToTop");
  let scrollTimeout;
  let isScrolling = false;

  if (!scrollButton) return;

  // Show button when scrolling down
  function handleScroll() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // Show button if scrolled more than 300px
    if (scrollPosition > 300) {
      scrollButton.classList.add("visible");
      isScrolling = true;

      // Clear existing timeout
      clearTimeout(scrollTimeout);

      // Hide button after 3 seconds of no scrolling
      scrollTimeout = setTimeout(() => {
        scrollButton.classList.remove("visible");
        isScrolling = false;
      }, 3000);
    } else {
      scrollButton.classList.remove("visible");
      isScrolling = false;
    }
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });
  scrollButton.addEventListener("click", scrollToTop);

  // Show button on hover even if timer expired
  scrollButton.addEventListener("mouseenter", () => {
    if (window.pageYOffset > 300) {
      clearTimeout(scrollTimeout);
      scrollButton.classList.add("visible");
    }
  });

  // Restart hide timer on mouse leave
  scrollButton.addEventListener("mouseleave", () => {
    if (window.pageYOffset > 300 && !isScrolling) {
      scrollTimeout = setTimeout(() => {
        scrollButton.classList.remove("visible");
      }, 3000);
    }
  });
})();
