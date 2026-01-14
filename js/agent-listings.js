document.addEventListener("DOMContentLoaded", () => {
  const agents = window.agentsData || [];
  const agentGrid = document.getElementById("staticAgentGrid");
  const resultsCount = document.getElementById("resultsCount");

  const renderAgents = () => {
    if (!agentGrid) return;
    agentGrid.innerHTML = "";

    agents.forEach((agent, index) => {
      const card = document.createElement("div");
      card.className = "agent-card-static glass-panel animate-slide-up";
      card.style.animationDelay = `${0.1 + index * 0.1}s`;

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
                class="btn btn-primary btn-block"
                onclick="openAgentContactModal('${agent.name}', '${agent.email}', '${agent.phone}')"
              >
                Contact Agent
              </button>
              <button
                class="btn btn-outline btn-block"
                onclick="window.location.href='agent/index.html?id=${agent.id}'"
              >
                View Profile
              </button>
            </div>
         `;
      agentGrid.appendChild(card);
    });

    if (resultsCount)
      resultsCount.textContent = `${agents.length} Agents found`;
  };

  renderAgents();

  const setupDropdown = (inputId, listId, dataList, iconClass) => {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (!input || !list) return;

    list.innerHTML = "";
    dataList.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="${iconClass}"></i> ${item}`;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = item;
        list.classList.remove("show");
      });
      list.appendChild(li);
    });

    input.addEventListener("focus", () => {
      if (list.children.length > 0) list.classList.add("show");
    });

    input.addEventListener("blur", () => {
      setTimeout(() => list.classList.remove("show"), 200);
    });

    input.addEventListener("input", () => {
      const query = input.value.toLowerCase();
      Array.from(list.children).forEach((li) => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? "flex" : "none";
      });
      list.classList.add("show");
    });
  };

  const cities = [
    "New York, NY",
    "Miami, FL",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
  ];
  const agentNames = agents.map((a) => a.name);

  setupDropdown(
    "locInput",
    "locSuggestions",
    cities,
    "fa-solid fa-location-dot"
  );
  setupDropdown("nameInput", "nameSuggestions", agentNames, "fa-solid fa-user");
});
