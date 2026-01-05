document.addEventListener("DOMContentLoaded", function () {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  // Load Header
  if (headerPlaceholder) {
    fetch("components/header.html")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load header");
        return response.text();
      })
      .then((data) => {
        headerPlaceholder.innerHTML = data;

        // Set active link based on current page
        const currentPage =
          window.location.pathname.split("/").pop() || "index.html";
        const navLinks = headerPlaceholder.querySelectorAll(".nav-list a");

        navLinks.forEach((link) => {
          const linkPage = link.getAttribute("href");
          if (linkPage === currentPage) {
            link.classList.add("active");
          }
        });
      })
      .catch((error) => console.error("Error loading header:", error));
  }

  // Load Footer
  if (footerPlaceholder) {
    fetch("components/footer.html")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load footer");
        return response.text();
      })
      .then((data) => {
        footerPlaceholder.innerHTML = data;
      })
      .catch((error) => console.error("Error loading footer:", error));
  }
});
