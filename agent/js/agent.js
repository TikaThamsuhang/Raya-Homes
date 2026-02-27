document.addEventListener("DOMContentLoaded", async () => {
  // Fetch agents data from JSON
  let agentsData = [];
  try {
    const response = await fetch("js/agents-data.json");
    agentsData = await response.json();
  } catch (error) {
    console.error("Error loading agents data:", error);
    document.body.innerHTML = `
      <div style="text-align:center; padding: 10rem 2rem; font-family: 'Outfit', sans-serif;">
        <h1 style="font-size: 2.5rem; color: #333;">Error Loading Agent Data</h1>
        <p style="color: #666; margin: 1rem 0;">Unable to load agent information. Please try again later.</p>
        <a href="../index.html" style="color: #3e2b26; text-decoration: underline; font-weight: 600;">Return to Home</a>
      </div>`;
    return;
  }

  // ============================================================================
  // PATH-BASED ROUTING DETECTION (FOR DEPLOYMENT)
  // ============================================================================
  // This allows URLs like: teamraya.com/lucy-muzhingi
  //
  // HOW IT WORKS:
  // 1. Check if there is a path segment (e.g. "/lucy-muzhingi") OR "agent" query param
  // 2. Find agent by matching slug
  // 3. Fallback to "id" param (legacy) or first agent

  const pathSlug = window.location.pathname.replace(/^\/|\/$/g, ""); // Extract "lucy-muzhingi"
  const urlParams = new URLSearchParams(window.location.search);
  const paramSlug = urlParams.get("agent"); // Get ?agent=lucy-muzhingi (from .htaccess rewrite)
  const lookupSlug =
    pathSlug && pathSlug !== "index.html" && pathSlug !== "profile.html"
      ? pathSlug
      : paramSlug;

  let agentBySlug = null;
  if (lookupSlug) {
    agentBySlug = agentsData.find((a) => a.slug === lookupSlug);
  }
  // ============================================================================

  // 1. Get Agent ID from URL (Legacy support for old links)
  const agentId = urlParams.get("id");

  // DYNAMIC BACK BUTTON LOGIC
  const backLink = document.querySelector(".back-link");
  if (backLink) {
    const referrer = document.referrer;
    // Check if user came from home-valuation page
    if (referrer && referrer.includes("home-valuation.html")) {
      backLink.href = "../home-valuation.html";
      backLink.querySelector("span").textContent = "Back To Valuation";
    } else {
      // Default to Agent Listings
      backLink.href = "index.html";
      backLink.querySelector("span").textContent = "Back To Agent List";
    }
  }

  // ============================================================================
  // AGENT SELECTION LOGIC
  // ============================================================================
  // Priority: URL slug > URL ID param > First agent

  const agent =
    agentBySlug || // First priority: URL slug
    (agentId ? agentsData.find((a) => a.id === agentId) : null) || // Second: URL param (legacy)
    agentsData[0]; // Fallback: first agent
  // ============================================================================

  // Helper to fix paths. For a standalone subdomain, we use local paths.
  const fixPath = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // External
    // If it's a local image path like "imgs/...", keep it as is for subdomain root
    if (path.startsWith("imgs/")) return path;
    return path;
  };

  // Error Handling: Agent Not Found
  if (!agent) {
    document.body.innerHTML = `
            <div style="text-align:center; padding: 10rem 2rem; font-family: 'Outfit', sans-serif;">
                <h1 style="font-size: 2.5rem; color: #333;">Agent Not Found</h1>
                <p style="color: #666; margin: 1rem 0;">We couldn't find the agent you're looking for.</p>
                <a href="../index.html" style="color: #3e2b26; text-decoration: underline; font-weight: 600;">Return to Home</a>
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
  setText("agentNameSmall", agent.name);
  setText("agentTitle", agent.title);
  setText("agentOfficeLink", agent.office);
  setText("agentLicense", agent.license);
  setText("agentBio", agent.bio);

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
    imgEl.src = fixPath(agent.photo) || "imgs/no-image.avif";
    imgEl.alt = agent.name;
    imgEl.onerror = function () {
      this.src = "imgs/no-image.avif";
    };
  }

  // Socials
  const socialsContainer = document.getElementById("agentSocials");
  if (socialsContainer && agent.socialLinks) {
    let socialHtml = "";
    if (agent.socialLinks.facebook) {
      socialHtml += `
            <div class="social-link-row">
                <a href="${agent.socialLinks.facebook}" target="_blank">
                    <i class="fa-brands fa-facebook-f"></i> <span>Facebook</span>
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
    if (agent.socialLinks.linkedin) {
      socialHtml += `
            <div class="social-link-row">
                <a href="${agent.socialLinks.linkedin}" target="_blank">
                    <i class="fa-brands fa-linkedin-in"></i> <span>Linkedin</span>
                </a>    
            </div>`;
    }

    // socialHtml += `
    //     <div class="social-link-row">
    //         <a href="#" target="_blank">
    //             <i class="fa-solid fa-link"></i> <span>View Agent Website</span>
    //         </a>
    //     </div>`;

    socialsContainer.innerHTML = socialHtml;
  }

  // 4. Handle Contact Form
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
        // Use Helper function for Popup
        createSuccessPopup(formData.name);

        // Reset Form
        contactForm.reset();
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = "";
      }, 1500);
    });
  }

  // 7. Success Popup Helper
  function createSuccessPopup(name) {
    // Check if one exists and remove it
    const existing = document.querySelector(".success-popup-modal");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.className = "success-popup-modal";
    popup.innerHTML = `
        <button class="popup-close-btn"><i class="fa-solid fa-xmark"></i></button>
        <div class="popup-checkmark-circle">
            <i class="fa-solid fa-check"></i>
        </div>
        <h3 class="popup-title">Message Sent!</h3>
        <p class="popup-desc">Thanks for reaching out, ${name || "Visitor"}.<br>I'll get back to you shortly.</p>
        <div class="popup-progress-bar"></div>
    `;

    document.body.appendChild(popup);

    // Auto Remove Logic
    let removed = false;
    const removePopup = () => {
      if (removed) return;
      removed = true;
      popup.style.animation = "popupFadeOut 0.4s forwards";
      setTimeout(() => popup.remove(), 400);
    };

    const timer = setTimeout(removePopup, 3000);

    // Close Button Logic
    popup.querySelector(".popup-close-btn").addEventListener("click", () => {
      clearTimeout(timer);
      removePopup();
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
});
