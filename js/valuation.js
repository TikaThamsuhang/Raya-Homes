// Extract address from URL parameter and populate fields
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const address = urlParams.get("address");

  if (address) {
    // Populate the search input field
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.value = address;
    }

    // Populate property address displays
    const addressTitle = document.getElementById("propertyAddressTitle");
    const addressFull = document.getElementById("propertyAddressFull");

    if (addressTitle) {
      // Extract just the street address for title
      const shortAddress = address.split(",")[0];
      addressTitle.textContent = shortAddress;
    }

    if (addressFull) {
      addressFull.textContent = address;
    }
  }
});
