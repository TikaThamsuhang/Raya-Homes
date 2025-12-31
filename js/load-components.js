document.addEventListener("DOMContentLoaded", function () {
    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    // Load Header
    if (headerPlaceholder) {
        fetch("components/header.html")
            .then(response => {
                if (!response.ok) throw new Error("Failed to load header");
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("Error loading header:", error));
    }

    // Load Footer
    if (footerPlaceholder) {
        fetch("components/footer.html")
            .then(response => {
                if (!response.ok) throw new Error("Failed to load footer");
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("Error loading footer:", error));
    }
});
