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

  // 1. Get Agent ID from URL
  const urlParams = new URLSearchParams(window.location.search);
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
      backLink.href = "../agent-listings.html";
      backLink.querySelector("span").textContent = "Back To Agent List";
    }
  }

  // Default to first agent if no ID provided for demo purposes, or handle error
  const agent = agentId
    ? agentsData.find((a) => a.id === agentId)
    : agentsData[0];

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

  // Stats
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
});
