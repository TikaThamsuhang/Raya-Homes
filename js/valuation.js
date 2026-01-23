// Extract address from URL parameter and populate fields
document.addEventListener("DOMContentLoaded", async function () {
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

  // --- Dynamic Agents Section ---
  const agentGrid = document.getElementById("valuationAgentGrid");
  if (agentGrid) {
    try {
      const response = await fetch("agent/js/agents-data.json");
      const agents = await response.json();

      // Pick first 2 agents 
      const selectedAgents = agents.slice(0, 2);

      agentGrid.innerHTML = "";

      selectedAgents.forEach((agent, index) => {
        const card = document.createElement("div");
        card.className = "agent-card-static glass-panel animate-slide-up";
        card.style.animationDelay = `${0.2 + index * 0.1}s`;

        const sold = agent.stats?.sold || "-";
        const active = agent.stats?.active || "-";
        const exp = agent.stats?.experience || "-";

        card.innerHTML = `
                <div class="agent-card-header">
                  <div class="agent-image-wrapper">
                    <img src="agent/${agent.photo}" alt="${agent.name}" onerror="this.src='agent/imgs/no-image.avif'" />
                  </div>
                  <div class="agent-info">
                    <h3>${agent.name}</h3>
                    <p class="agent-title">${agent.title}</p>
                    <div class="agent-contact-info">
                      <div class="contact-row">
                        <i class="fa-solid fa-phone"></i> ${agent.phone}
                      </div>
                      <div class="contact-row">
                        <i class="fa-solid fa-envelope"></i>
                        ${agent.email}
                      </div>
                    </div>
                  </div>
                  <div class="agent-logo-badge">
                    <img src="imgs/logo-no-background.png" alt="Raya Homes" />
                  </div>
                </div>

                <div class="agent-stats-row">
                  <div class="stat-item">
                    <span class="stat-value">${sold}</span>
                    <span class="stat-label">Sold</span>
                  </div>
                  <div class="stat-separator"></div>
                  <div class="stat-item">
                    <span class="stat-value">${active}</span>
                    <span class="stat-label">Active</span>
                  </div>
                  <div class="stat-separator"></div>
                  <div class="stat-item">
                    <span class="stat-value">${exp}</span>
                    <span class="stat-label">Experience</span>
                  </div>
                </div>

                <div class="agent-actions">
                  <button
                    class="btn-primary btn-block"
                    onclick="openAgentContactModal('${agent.name}', '${agent.email}', '${agent.phone}')"
                  >
                    Contact Agent
                  </button>
                  <button
                    class="btn-outline btn-block"
                    onclick="window.location.href='agent/index.html?id=${agent.id}'"
                  >
                    View Profile
                  </button>
                </div>
            `;
        agentGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading agents for valuation page:", error);
    }
  }
});
