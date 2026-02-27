/**
 * property-detail.js
 * ============================================================
 * Drives property-detail.html — the individual property page.
 *
 * Responsibilities:
 *  1. Reads ?id=<slug> from the URL to identify which property to show
 *  2. Fetches all property data from js/properties-data.json
 *  3. Populates every section of the page dynamically:
 *     - Gallery hero images and thumbnails
 *     - Price, status badge, specs (beds/baths/sqft/type), address
 *     - Agent/listing info strip + mini map
 *     - About This Home description
 *     - Home Facts grid
 *     - Rooms, Structure, Lot, Schools, Financials sections
 *     - Listing Agent card
 *     - New Listings carousel (other properties)
 *  4. Re-initializes interactive UI:
 *     - Hero image prev/next arrows (cycles main photo)
 *     - Gallery overlay (full-screen lightbox with Photos/Map tabs,
 *       prev/next, thumbnail strip, keyboard navigation)
 *     - Header scroll effect
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ============================================================
  // 1. READ THE PROPERTY SLUG FROM THE URL
  // e.g. property-detail.html?id=schnoor-road-ct → slug = "schnoor-road-ct"
  // ============================================================
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("id"); // Get the ?id= value from the URL

  // ============================================================
  // 2. FETCH ALL PROPERTY DATA FROM JSON
  // ============================================================
  let properties = [];
  try {
    const response = await fetch("js/properties-data.json");
    if (!response.ok) throw new Error("Network response was not ok");
    properties = await response.json();
  } catch (error) {
    console.error("Error loading properties data:", error);
    // Show a user-friendly error page if the JSON fails to load
    document.body.innerHTML = `
      <div style="text-align:center; padding:10rem 2rem; font-family:'Outfit',sans-serif;">
        <h1 style="font-size:2.5rem; color:#333;">Error Loading Property</h1>
        <p style="color:#666; margin:1rem 0;">Unable to load property information. Please try again later.</p>
        <a href="property.html" style="color:#3e2b26; text-decoration:underline; font-weight:600;">Back To Listings</a>
      </div>`;
    return;
  }

  // ============================================================
  // 3. FIND THE PROPERTY MATCHING THE SLUG
  // Falls back to the first property if no ?id= param is provided
  // ============================================================
  const property = slug
    ? properties.find((p) => p.slug === slug)
    : properties[0];

  // If a slug was given but not found, show a 404-style message
  if (!property) {
    document.body.innerHTML = `
      <div style="text-align:center; padding:10rem 2rem; font-family:'Outfit',sans-serif;">
        <h1 style="font-size:2.5rem; color:#333;">Property Not Found</h1>
        <p style="color:#666; margin:1rem 0;">We couldn't find the property you're looking for.</p>
        <a href="property.html" style="color:#3e2b26; text-decoration:underline; font-weight:600;">Back To Listings</a>
      </div>`;
    return;
  }

  // ============================================================
  // 4. HELPER FUNCTIONS
  // ============================================================

  // Sets the text content of an element by its ID (silently skips if not found)
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text ?? "";
  };

  // Sets the src of an <img> element by its ID, with an optional fallback on error
  const setSrc = (id, src, fallback = "") => {
    const el = document.getElementById(id);
    if (el) {
      el.src = src;
      el.onerror = () => {
        el.src = fallback;
      };
    }
  };

  // Formats a number as a US dollar price string, e.g. 890000 → "$890,000"
  const formatPrice = (price) => "$" + Number(price).toLocaleString("en-US");

  // ============================================================
  // 5. SEO — Update page title and meta description dynamically
  // ============================================================
  document.title = `${property.address} | Raya Homes`;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `${property.beds} bed, ${property.baths} bath home at ${property.address}. Listed at ${formatPrice(property.price)} by Raya Homes.`;

  // ============================================================
  // 6. GALLERY IMAGES — populate bento-grid hero area
  // Main hero image = photos[0], thumbnails = photos[1], [2], [3]
  // ============================================================
  const mainHeroImg = document.getElementById("mainGalleryImg");
  if (mainHeroImg) {
    mainHeroImg.src = property.photos[0] || "";
    mainHeroImg.alt = property.title;
  }

  // Right-side thumbnails (up to 3, maps to photos[1], [2], [3])
  ["galleryThumb1", "galleryThumb2", "galleryThumb3"].forEach((id, index) => {
    const photo = property.photos[index + 1];
    if (photo) setSrc(id, photo, "imgs/no-image.avif");
  });

  // Update total count in the "See all X photos" button and hero counter
  const totalCountEl = document.getElementById("heroTotalCount");
  if (totalCountEl) totalCountEl.textContent = property.photos.length;

  const seeAllBtn = document.querySelector(".btn-see-all");
  if (seeAllBtn)
    seeAllBtn.textContent = `See all ${property.photos.length} photos`;

  // ============================================================
  // 7. PRICE, STATUS BADGE, SPECS, ADDRESS
  // ============================================================

  // Price (e.g. "$539,900")
  const priceEl = document.getElementById("propertyPrice");
  if (priceEl) priceEl.textContent = formatPrice(property.price);

  // Status badge — updates class and icon based on listing status
  const statusBadge = document.getElementById("propertyStatusBadge");
  if (statusBadge) {
    const statusMap = {
      "for-sale": {
        text: "For Sale",
        icon: "fa-circle-check",
        cls: "for-sale",
      },
      "coming-soon": {
        text: "Coming Soon",
        icon: "fa-clock",
        cls: "coming-soon",
      },
      sold: { text: "Sold", icon: "fa-lock", cls: "sold" },
      pending: {
        text: "Pending",
        icon: "fa-hourglass-half",
        cls: "coming-soon",
      },
    };
    const s = statusMap[property.status] || {
      text: property.status,
      icon: "",
      cls: "",
    };
    statusBadge.className = `status-tag ${s.cls}`;
    statusBadge.innerHTML = `${s.text} <i class="fa-solid ${s.icon}"></i>`;
  }

  // Key specs row
  setText("propBeds", property.beds);
  setText("propBaths", property.baths);
  setText("propSqft", property.sqft.toLocaleString());
  setText("propType", property.facts.propertyType);

  // Full address
  setText("propertyAddress", property.address);

  // ============================================================
  // 8. AGENT / LISTING INFO STRIP
  // ============================================================
  const listedByEl = document.getElementById("listedByName");
  if (listedByEl)
    listedByEl.textContent = `${property.listedBy} ${property.agent.phone}`;

  setText(
    "brokerageName",
    `${property.brokerage} \u2022 ${property.agent.phone}`,
  );
  setText("mlsSource", `Source: ${property.source}`);
  setText("mlsNumber", `MLS# ${property.mls}`);

  const updatedEl = document.getElementById("listingUpdated");
  if (updatedEl && property.listingDate) {
    const date = new Date(property.listingDate);
    updatedEl.textContent = `Updated: ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  // Update the mini-map iframe src to match this property's location
  const miniMap = document.getElementById("miniMapIframe");
  if (miniMap && property.mapEmbed) miniMap.src = property.mapEmbed;

  // Update the gallery overlay title with the full property address
  const galleryTitle = document.getElementById("galleryTitle");
  if (galleryTitle) galleryTitle.textContent = property.address;

  // Update the gallery overlay Map tab iframe with this property's location
  const galleryMapIframe = document.getElementById("galleryMapIframe");
  if (galleryMapIframe && property.mapEmbed)
    galleryMapIframe.src = property.mapEmbed;

  // ============================================================
  // 9. "ABOUT THIS HOME" DESCRIPTION
  // Splits the description on double newlines to create paragraphs
  // ============================================================
  const descContainer = document.getElementById("descriptionContainer");
  if (descContainer && property.description) {
    descContainer.innerHTML = property.description
      .split("\n\n")
      .map((p) => `<p>${p.trim()}</p>`)
      .join("");
  }
  setText("aboutHomeSubtitle", property.title);

  // ============================================================
  // 10. HOME FACTS GRID
  // ============================================================
  setText("factPropertyType", property.facts.propertyType);
  setText("factYearBuilt", property.facts.yearBuilt);
  setText("factHeating", property.facts.heating);
  setText("factCooling", property.facts.cooling);
  setText("factGarage", property.facts.garage);
  setText("factLotSize", property.facts.lotSize);

  // ============================================================
  // 11. ROOMS & INTERIOR SECTION
  // ============================================================
  setText("prop-beds-detail", property.beds);
  setText("prop-baths-total", property.baths);
  setText("prop-baths-full", property.bathsFull);
  setText("prop-baths-half", property.bathsHalf);
  setText("prop-living-area", property.interior.livingArea);
  setText("prop-basement", property.interior.basement);
  setText("prop-fireplaces", property.interior.fireplaces);

  // ============================================================
  // 11b. INTERIOR AREA DETAILS
  // ============================================================
  if (property.interior) {
    setText("prop-total-structure-area", property.interior.totalStructureArea);
    setText("prop-total-livable-area", property.interior.totalLivableArea);
    setText("prop-finished-above", property.interior.finishedAboveGround);
    setText("prop-finished-below", property.interior.finishedBelowGround);
    setText("prop-flooring", property.interior.flooring);
    setText("prop-laundry", property.interior.laundry);
    // Appliances — join the array into a readable comma-separated string
    if (
      property.interior.appliances &&
      property.interior.appliances.length > 0
    ) {
      setText("prop-appliances", property.interior.appliances.join(", "));
    }
    // Interior Features — join the array into a readable comma-separated string
    if (property.interior.features && property.interior.features.length > 0) {
      setText("prop-interior-features", property.interior.features.join(", "));
    }
  }

  // ============================================================
  // 12. STRUCTURE SECTION
  // ============================================================
  setText("prop-build-area", property.structure.buildArea);
  setText("prop-year-built", property.structure.yearBuilt);
  setText("prop-sub-type", property.structure.subType);

  // ============================================================
  // 13. LOT SECTION
  // ============================================================
  setText("prop-lot-size", property.facts.lotSize);

  // ============================================================
  // 13b. ENRICHED LOT DETAILS
  // ============================================================
  if (property.lot) {
    setText("prop-lot-features", property.lot.features);
    setText("prop-parcel-number", property.lot.parcelNumber);
    setText("prop-zoning", property.lot.zoning);
    setText("prop-special-conditions", property.lot.specialConditions);
  }

  // ============================================================
  // 13c. PARKING
  // ============================================================
  if (property.exterior) {
    setText("prop-parking-spaces", property.exterior.parkingSpaces);
    setText("prop-garage-spaces", property.exterior.attachedGarageSpaces);
    setText("prop-parking-features", property.exterior.parkingFeatures);
    // Exterior & Property Features
    setText("prop-levels", property.exterior.levels);
    setText("prop-patio", property.exterior.patio);
    setText("prop-exterior-features", property.exterior.exteriorFeatures);
    setText("prop-pool-features", property.exterior.poolFeatures);
    setText("prop-fencing", property.exterior.fencing);
    setText("prop-has-view", property.exterior.hasView ? "Yes" : "No");
  }

  // ============================================================
  // 13d. CONSTRUCTION DETAILS
  // ============================================================
  if (property.structure) {
    setText("prop-home-type", property.structure.homeType);
    setText("prop-arch-style", property.structure.architecturalStyle);
    setText("prop-prop-subtype", property.structure.propertySubtype);
    setText("prop-materials", property.structure.materials);
    setText("prop-foundation", property.facts.foundation);
    setText(
      "prop-roof",
      property.structure.roof || (property.exterior && property.exterior.roof),
    );
    setText(
      "prop-new-construction",
      property.structure.newConstruction ? "Yes" : "No",
    );
  }

  // ============================================================
  // 13e. UTILITIES
  // ============================================================
  if (property.utilities) {
    setText("prop-utilities-water", property.utilities.water);
    setText("prop-utilities-sewer", property.utilities.sewer);
    setText("prop-utilities-list", property.utilities.utilities);
  }

  // ============================================================
  // 14. SCHOOLS SECTION
  // ============================================================
  setText("prop-school-elem", property.schools.elementary);
  setText("prop-school-middle", property.schools.middle);
  setText("prop-school-high", property.schools.high);

  // ============================================================
  // 15. FINANCES & DISCLOSURES
  // ============================================================
  setText("prop-finance-price", formatPrice(property.financials.price));
  setText("prop-tax-amt", formatPrice(property.financials.taxAnnual));
  setText("prop-hoa-fee", property.financials.hoaFee);
  // Additional financial details
  if (property.financials.hoaServices)
    setText("prop-hoa-services", property.financials.hoaServices);
  if (property.pricePerSqft)
    setText("prop-price-sqft", "$" + property.pricePerSqft + "/sqft");
  if (property.financials.taxAssessedValue)
    setText(
      "prop-tax-assessed",
      "$" + property.financials.taxAssessedValue.toLocaleString("en-US"),
    );

  setText("prop-mls-id", property.mls);
  setText("prop-mls-status", property.mlsStatus);

  // ============================================================
  // 16. LISTING AGENT CARD
  // ============================================================
  const agentPhoto = document.getElementById("listingAgentPhoto");
  if (agentPhoto) {
    agentPhoto.src = property.agent.photo;
    agentPhoto.alt = property.agent.name;
    agentPhoto.onerror = () => {
      agentPhoto.src = "imgs/Agents/placeholder.jpg";
    };
  }
  setText("listingAgentName", property.agent.name);

  const agentPhoneEl = document.getElementById("listingAgentPhone");
  if (agentPhoneEl) agentPhoneEl.textContent = property.agent.phone;

  const agentEmailEl = document.getElementById("listingAgentEmail");
  if (agentEmailEl) {
    agentEmailEl.textContent = property.agent.email;
    agentEmailEl.href = `mailto:${property.agent.email}`;
  }

  setText("agentSectionAddress", property.title);
  setText("nearAddressText", property.title);

  // ============================================================
  // 17. PRE-FILL CONTACT FORM
  // ============================================================
  const contactMsg = document.getElementById("contactMsg");
  if (contactMsg)
    contactMsg.textContent = `Hi, I would like to know more about ${property.address}`;

  // ============================================================
  // 18. "NEW LISTINGS" CAROUSEL
  // Shows all other properties (excluding the current one),
  // each rendered as a listing-card with a slider and link
  // ============================================================
  const carouselTrack = document.getElementById("newListingsTrack");
  if (carouselTrack) {
    const otherProperties = properties.filter((p) => p.slug !== property.slug);
    carouselTrack.innerHTML = ""; // Clear hardcoded placeholder cards

    otherProperties.forEach((prop) => {
      const card = document.createElement("div");
      card.className = "listing-card carousel-card";

      // Build photo slider HTML — first image gets "active" class
      const photosHtml = prop.photos
        .map(
          (src, i) =>
            `<img src="${src}" alt="${prop.title}" ${i === 0 ? 'class="active"' : ""} />`,
        )
        .join("");

      // Status badge HTML
      const statusBadgeMap = {
        "for-sale": `<span class="status-tag for-sale">For Sale <i class="fa-solid fa-circle-check"></i></span>`,
        "coming-soon": `<span class="status-tag coming-soon">Coming Soon <i class="fa-solid fa-clock"></i></span>`,
        sold: `<span class="status-tag sold">Sold <i class="fa-solid fa-lock"></i></span>`,
        pending: `<span class="status-tag coming-soon">Pending <i class="fa-solid fa-hourglass-half"></i></span>`,
      };

      card.innerHTML = `
        <div class="card-image-wrapper">
          <div class="image-slider">
            ${photosHtml}
          </div>
          <button class="slider-btn prev"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="slider-btn next"><i class="fa-solid fa-chevron-right"></i></button>
          <div class="slider-counter">1/${prop.photos.length}</div>
          ${statusBadgeMap[prop.status] || ""}
        </div>
        <div class="card-content">
          <div class="d-flex justify-between align-center mb-1">
            <h3 class="card-price">${formatPrice(prop.price)}</h3>
          </div>
          <div class="card-specs">
            ${prop.beds} Beds &nbsp; ${prop.baths} Baths &nbsp; ${prop.sqft.toLocaleString()} Sq. Ft.
          </div>
          <div class="card-address">${prop.address}</div>
          <div class="d-flex justify-between align-center">
            <!-- Link to that property's detail page -->
            <a href="property-detail.html?id=${prop.slug}" class="email-agent-btn">View Details</a>
          </div>
        </div>
      `;
      carouselTrack.appendChild(card);
    });

    // Initialize the card image sliders if the global helper is available
    if (typeof initSliders === "function") initSliders();
  }

  // ============================================================
  // 19. HEADER SCROLL EFFECT
  // Shrinks / styles the sticky header when the user scrolls
  // ============================================================
  const header = document.querySelector(".detail-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  // ============================================================
  // 20. HERO IMAGE PREV / NEXT ARROWS
  // Cycles through property.photos in the main bento-grid view
  // WITHOUT opening the overlay.
  // heroIndex = which photo is currently shown in the hero slot
  // ============================================================
  const allPhotos = property.photos; // shorthand for the photos array
  let heroIndex = 0; // tracks current hero image

  const heroPrevBtn = document.getElementById("heroPrevBtn");
  const heroNextBtn = document.getElementById("heroNextBtn");
  const heroCurrentEl = document.getElementById("heroCurrentIndex");

  // Swaps the hero image and updates the X/Y counter
  const updateHeroImage = () => {
    if (mainHeroImg) mainHeroImg.src = allPhotos[heroIndex] || "";
    if (heroCurrentEl) heroCurrentEl.textContent = heroIndex + 1;
  };

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener("click", () => {
      // Wrap around: going left from photo 0 goes to the last photo
      heroIndex = (heroIndex - 1 + allPhotos.length) % allPhotos.length;
      updateHeroImage();
    });
  }
  if (heroNextBtn) {
    heroNextBtn.addEventListener("click", () => {
      // Wrap around: going right from the last photo goes to photo 0
      heroIndex = (heroIndex + 1) % allPhotos.length;
      updateHeroImage();
    });
  }

  // ============================================================
  // 21. GALLERY OVERLAY (Full-Screen Lightbox)
  // Opens when clicking:
  //   - The main hero image
  //   - Any right-side thumbnail
  //   - The "See all X photos" floating button
  //
  // Inside the overlay:
  //   - Photos tab: large image viewer with prev/next arrows
  //   - Map tab: embedded Google Maps iframe
  //   - Thumbnail strip at bottom (click to jump to any photo)
  //   - Arrow key navigation (left/right) + Escape to close
  // ============================================================
  let overlayIndex = 0; // which photo is currently shown inside the overlay

  // --- DOM refs for the overlay ---
  const galleryOverlay = document.getElementById("gallery-overlay");
  const overlayMainImg = document.getElementById("galleryMainImage"); // large image inside overlay viewer
  const galleryPrevBtn = document.getElementById("galleryPrevBtn");
  const galleryNextBtn = document.getElementById("galleryNextBtn");
  const closeGalleryBtn = document.getElementById("closeGalleryBtn");
  const currentIndexEl = document.getElementById("currentImageIndex");
  const totalImagesEl = document.getElementById("totalImages");
  const thumbnailStrip = document.getElementById("thumbnailStrip");
  const photoView = document.getElementById("photoView");
  const mapView = document.getElementById("mapView");
  const videoView = document.getElementById("videoView");
  const galleryVideoTab = document.getElementById("galleryVideoTab");
  const galleryVideoPlayer = document.getElementById("galleryVideoPlayer");

  // Show/Hide Video Tab in Overlay
  if (galleryVideoTab && galleryVideoPlayer) {
    if (property.video) {
      galleryVideoPlayer.src = property.video;
      galleryVideoTab.style.display = "inline-block";
    } else {
      galleryVideoTab.style.display = "none";
    }
  }

  // Set the "Y" in "X of Y" in the overlay footer
  if (totalImagesEl) totalImagesEl.textContent = allPhotos.length;

  // --- Build thumbnail strip from JSON photos ---
  // Replaces the hardcoded placeholder thumbnails in the HTML
  if (thumbnailStrip && allPhotos.length > 0) {
    thumbnailStrip.innerHTML = "";
    allPhotos.forEach((src, i) => {
      const thumb = document.createElement("div");
      thumb.className = "thumb" + (i === 0 ? " active" : "");
      thumb.innerHTML = `<img src="${src}" alt="Photo ${i + 1}" />`;
      // Clicking a thumbnail jumps directly to that photo in the viewer
      thumb.addEventListener("click", () => {
        overlayIndex = i;
        updateOverlayView();
      });
      thumbnailStrip.appendChild(thumb);
    });
  }

  // --- Helper: sync overlay large image, counter, and active thumbnail ---
  const updateOverlayView = () => {
    // Update the big image in the photo viewer
    if (overlayMainImg) {
      overlayMainImg.src = allPhotos[overlayIndex] || "";
      overlayMainImg.alt = `Photo ${overlayIndex + 1}`;
    }
    // Update "X of Y" counter text
    if (currentIndexEl) currentIndexEl.textContent = overlayIndex + 1;
    // Highlight the matching thumbnail and scroll it into view
    if (thumbnailStrip) {
      thumbnailStrip.querySelectorAll(".thumb").forEach((t, i) => {
        t.classList.toggle("active", i === overlayIndex);
      });
      const activeThumb = thumbnailStrip.querySelector(".thumb.active");
      if (activeThumb)
        activeThumb.scrollIntoView({ block: "nearest", inline: "center" });
    }
  };

  // --- Opens the overlay at a specific photo index ---
  const openGallery = (startIndex) => {
    if (!galleryOverlay) return;
    // Clamp the index to valid range
    overlayIndex = Math.max(0, Math.min(startIndex, allPhotos.length - 1));
    updateOverlayView();
    // Default to the Photos tab whenever the overlay opens
    if (photoView) photoView.classList.remove("hidden");
    if (mapView) mapView.classList.add("hidden");
    if (videoView) videoView.classList.add("hidden");
    document.querySelectorAll(".gallery-tabs .tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === "photos");
    });
    const galleryFooter = document.querySelector(".gallery-footer");
    if (galleryFooter) galleryFooter.style.display = "block";
    // Show the overlay and prevent the page from scrolling behind it
    galleryOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  // --- Closes the overlay and restores page scroll ---
  const closeGallery = () => {
    if (!galleryOverlay) return;
    galleryOverlay.classList.remove("active");
    if (galleryVideoPlayer) galleryVideoPlayer.pause();
    document.body.style.overflow = "";
  };

  // --- OPEN TRIGGERS ---

  // 1. Click the main hero image → opens at whichever hero arrow slide is showing
  if (mainHeroImg) {
    mainHeroImg.style.cursor = "pointer";
    mainHeroImg.addEventListener("click", () => openGallery(heroIndex));
  }

  // 2. Click a right-side thumbnail → opens at its corresponding index (1, 2, 3)
  [1, 2, 3].forEach((n, i) => {
    const thumbEl = document.getElementById(`galleryThumb${n}`);
    if (thumbEl) {
      thumbEl.style.cursor = "pointer";
      thumbEl.addEventListener("click", () => openGallery(i + 1));
    }
  });

  // 3. "See all X photos" button → opens overlay at the current hero slide
  const seeAllButton = document.querySelector(".btn-see-all");
  if (seeAllButton) {
    seeAllButton.addEventListener("click", () => openGallery(heroIndex));
  }

  // --- CLOSE TRIGGERS ---
  if (closeGalleryBtn) closeGalleryBtn.addEventListener("click", closeGallery);

  // Clicking the backdrop (outside the gallery modal panel) also closes it
  if (galleryOverlay) {
    galleryOverlay.addEventListener("click", (e) => {
      if (
        e.target === galleryOverlay ||
        e.target.classList.contains("gallery-backdrop")
      ) {
        closeGallery();
      }
    });
  }

  // --- KEYBOARD NAVIGATION ---
  document.addEventListener("keydown", (e) => {
    if (!galleryOverlay || !galleryOverlay.classList.contains("active")) return;
    if (e.key === "Escape") {
      // Escape key closes the overlay
      closeGallery();
    } else if (e.key === "ArrowLeft") {
      // Left arrow goes to previous photo (wraps around)
      overlayIndex = (overlayIndex - 1 + allPhotos.length) % allPhotos.length;
      updateOverlayView();
    } else if (e.key === "ArrowRight") {
      // Right arrow goes to next photo (wraps around)
      overlayIndex = (overlayIndex + 1) % allPhotos.length;
      updateOverlayView();
    }
  });

  // --- OVERLAY PREV / NEXT ARROW BUTTONS ---
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener("click", () => {
      overlayIndex = (overlayIndex - 1 + allPhotos.length) % allPhotos.length;
      updateOverlayView();
    });
  }
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener("click", () => {
      overlayIndex = (overlayIndex + 1) % allPhotos.length;
      updateOverlayView();
    });
  }

  // --- PHOTOS / MAP TAB SWITCHING INSIDE OVERLAY ---
  document.querySelectorAll(".gallery-tabs .tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active from all tabs, set on clicked one
      document
        .querySelectorAll(".gallery-tabs .tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab; // "photos" or "map"
      // Show the correct content panel, hide the other
      if (photoView) photoView.classList.toggle("hidden", tab !== "photos");
      if (mapView) mapView.classList.toggle("hidden", tab !== "map");
      if (videoView) videoView.classList.toggle("hidden", tab !== "video");

      // Hide footer if not on photos tab
      const galleryFooter = document.querySelector(".gallery-footer");
      if (galleryFooter)
        galleryFooter.style.display = tab === "photos" ? "block" : "none";

      // Pause video if navigating away from video tab
      if (tab !== "video" && galleryVideoPlayer) {
        galleryVideoPlayer.pause();
      }
    });
  });

  // --- THUMBNAIL STRIP PREV / NEXT SCROLL BUTTONS ---
  // These scroll the thumbnail strip horizontally in the overlay footer
  const stripPrevBtn = document.querySelector(".strip-nav.prev");
  const stripNextBtn = document.querySelector(".strip-nav.next");
  const STRIP_SCROLL = 150; // px per button click

  if (stripPrevBtn && thumbnailStrip) {
    stripPrevBtn.addEventListener("click", () => {
      thumbnailStrip.scrollBy({ left: -STRIP_SCROLL, behavior: "smooth" });
    });
  }
  if (stripNextBtn && thumbnailStrip) {
    stripNextBtn.addEventListener("click", () => {
      thumbnailStrip.scrollBy({ left: STRIP_SCROLL, behavior: "smooth" });
    });
  }

  // ============================================================
  // 22. HIDE LOADER & SHOW CONTENT
  // ============================================================
  const loader = document.getElementById("propertyLoader");
  const content = document.getElementById("propertyContent");
  if (loader && content) {
    loader.style.display = "none";
    content.style.display = "block";
  }
});
