document.addEventListener("DOMContentLoaded", () => {
  // 1. Get Agent ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const agentId = urlParams.get("id");

  // Default to first agent if no ID provided for demo purposes, or handle error
  const agent = agentId
    ? window.agentsData.find((a) => a.id === agentId)
    : window.agentsData[0];

  // Helper to fix paths (since we are deeper in the folder structure)
  const fixPath = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // External
    if (path.startsWith("../")) return path; // Already fixed
    return `../${path}`;
  };

  // Error Handling: Agent Not Found
  if (!agent) {
    document.body.innerHTML = `
            <div style="text-align:center; padding: 10rem 2rem; font-family: 'Outfit', sans-serif;">
                <h1 style="font-size: 2.5rem; color: #333;">Agent Not Found</h1>
                <p style="color: #666; margin: 1rem 0;">We couldn't find the agent you're looking for.</p>
                <a href="../index.html" style="color: #3e2b26; text-decoration: none; font-weight: 600;">Return to Home</a>
            </div>`;
    return;
  }

  // 2. SEO & Metadata Updates
  document.title = `${agent.name} | ${agent.title} | Raya Homes`;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = `Meet ${agent.name}, ${
    agent.title
  } at Raya Homes. ${agent.bio.substring(0, 150)}...`;

  // 3. Populate Agent Details
  setText("agentName", agent.name);
  setText("agentNameSmall", agent.name); // In listings header
  setText("agentTitle", agent.title);
  setText("agentOfficeLink", agent.office);
  setText("agentLicense", agent.license);
  setText("agentBio", agent.bio); // Bio might be HTML safe? existing data is plain text.

  // Stats (Bottom bar)
  if (agent.stats) {
    setText("statSold", agent.stats.sold);
    setText("statActive", agent.stats.active);
    setText("statExperience", agent.stats.experience);
  }

  // Contact Info
  setText("agentPhoneDisplay", agent.phone);

  const emailLink = document.getElementById("agentEmailLink");
  if (emailLink) {
    emailLink.textContent = agent.email;
    emailLink.href = `mailto:${agent.email}`;
  }

  // Image
  const imgEl = document.getElementById("agentImage");
  if (imgEl) {
    imgEl.src = fixPath(agent.photo) || "../imgs/placeholder-agent.jpg";
    imgEl.alt = agent.name;
    imgEl.onerror = function () {
      this.src = "../imgs/no-image.avif";
    };
  }

  // Socials (Vertical List with Labels)
  const socialsContainer = document.getElementById("agentSocials");
  if (socialsContainer && agent.socialLinks) {
    let socialHtml = "";
    if (agent.socialLinks.linkedin) {
      socialHtml += `
            <div class="social-link-row">
                <a href="${agent.socialLinks.linkedin}" target="_blank">
                    <i class="fa-brands fa-linkedin-in"></i> <span>Linkedin</span>
                </a>    
            </div>`;
    }
    if (agent.socialLinks.instagram) {
      socialHtml += `
            <div class="social-link-row">
                <a href="${agent.socialLinks.instagram}" target="_blank">
                    <i class="fa-brands fa-instagram"></i> <span>Instagram</span>
                </a>
            </div>`;
    }
    // Fake website link if not present (design has "View Agent Website")
    socialHtml += `
        <div class="social-link-row">
            <a href="#" target="_blank">
                <i class="fa-solid fa-link"></i> <span>View Agent Website</span>
            </a>
        </div>`;

    socialsContainer.innerHTML = socialHtml;
  }

  // 4. Resolve and Populate Listings
  const listingsGrid = document.getElementById("agentListingsGrid");
  if (listingsGrid) {
    // Filter properties
    const agentProperties = window.propertiesData.filter(
      (prop) => agent.listingIds && agent.listingIds.includes(prop.id)
    );

    setText("agentListingCount", agentProperties.length);

    if (agentProperties.length > 0) {
      // Adjust image paths for "agent/" directory context
      const finalPropeties = agentProperties.map((prop) => {
        const fix = (path) =>
          path && path.startsWith("imgs/") ? "../" + path : path;

        return {
          ...prop,
          image: fix(prop.image),
          images: prop.images
            ? prop.images.map(fix)
            : prop.image
            ? [fix(prop.image)]
            : [],
        };
      });

      listingsGrid.innerHTML = finalPropeties
        .map((listing) => createPortfolioCard(listing))
        .join("");
    } else {
      listingsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-house-chimney" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p style="color: #666;">${agent.name} currently has no active exclusive listings.</p>
            </div>`;
    }
  }

  // 5. Handle Contact Form
  const contactForm = document.getElementById("agentContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;

      // Collect Data (Mock)
      const formData = {
        name: document.getElementById("contactName").value,
        email: document.getElementById("contactEmail").value,
        phone: document.getElementById("contactPhone").value,
        msg: document.getElementById("contactMsg").value,
      };
      console.log("Form Submitted:", formData);

      // Simulate API
      btn.innerText = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        btn.innerText = "Message Sent";
        btn.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.backgroundColor = "";
          btn.disabled = false;
          contactForm.reset();
          alert(`Message sent to ${agent.name}!`);
        }, 3000);
      }, 1000);
    });
  }

  // 6. Header Scroll Effect
  const header = document.querySelector(".detail-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Helper Functions
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || "";
  }

  function createPortfolioCard(listing) {
    // Fallback images
    const images =
      listing.images && listing.images.length
        ? listing.images
        : ["../imgs/no-image.avif"];

    // Create slides HTML
    const slidesHtml = images
      .map(
        (img) => `
            <div class="img-slide" style="background-image: url('${img}')"></div>
        `
      )
      .join("");

    // Dynamic Status Class
    let statusClass = "for-sale";
    const statusLower = (listing.status || "").toLowerCase();
    if (statusLower.includes("sold")) statusClass = "sold";
    else if (statusLower.includes("soon")) statusClass = "coming-soon";

    return `
            <div class="portfolio-card">
              <!-- Image Slider -->
              <div class="img-slider-container">
                <div class="img-slider-track">
                    ${slidesHtml}
                </div>

                <!-- Controls -->
                <button class="slider-arrow slider-prev" onclick="moveSlide(this, -1)">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button class="slider-arrow slider-next" onclick="moveSlide(this, 1)">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- Pagination -->
                <div class="slider-pagination">1/${images.length}</div>

                <!-- Fav Icon -->
                <button class="fav-icon-small">
                  <i class="fa-regular fa-heart"></i>
                </button>
              </div>

              <div class="content-container">
                <div class="portfolio-card-header">
                  <h3 class="prop-title">${listing.address.split(",")[0]}</h3>
                  <div class="status-tag ${statusClass}" style="font-size: 0.6rem; padding: 0.2rem 0.6rem">
                    ${
                      listing.status || "Active"
                    } <i class="fa-solid fa-circle-check"></i>
                  </div>
                </div>
                <p class="prop-specs">${listing.beds} Beds ${
      listing.baths
    } Baths ${listing.sqft} Sq. Ft.</p>
                <p class="prop-address">${listing.address}</p>
                <div class="divider"></div>
                <div class="prop-price">${listing.price}</div>
              </div>
            </div>
        `;
  }

  // Slider Logic
  window.moveSlide = function (btn, direction) {
    const card = btn.closest(".portfolio-card");
    const track = card.querySelector(".img-slider-track");
    const slides = card.querySelectorAll(".img-slide");
    const pagination = card.querySelector(".slider-pagination");

    let activeIndex = parseInt(track.dataset.index || 0);
    const totalSlides = slides.length;

    // Update index
    activeIndex += direction;

    // Loop
    if (activeIndex < 0) activeIndex = totalSlides - 1;
    if (activeIndex >= totalSlides) activeIndex = 0;

    // Apply transform
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    track.dataset.index = activeIndex;

    // Update pagination
    pagination.textContent = `${activeIndex + 1}/${totalSlides}`;

    // Prevent bubble up
    if (event) event.stopPropagation();
  };
});
