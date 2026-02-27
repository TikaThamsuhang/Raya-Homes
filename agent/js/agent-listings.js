document.addEventListener("DOMContentLoaded", async () => {
  // Fetch agents data from JSON
  let agents = [];
  try {
    const response = await fetch("js/agents-data.json");
    agents = await response.json();
  } catch (error) {
    console.error("Error loading agents data:", error);
    const agentGrid = document.getElementById("staticAgentGrid");
    if (agentGrid) {
      agentGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <i class="fa-solid fa-exclamation-triangle" style="font-size: 3rem; color: #f44336; margin-bottom: 1rem;"></i>
          <p style="color: #666;">Unable to load agent data. Please try again later.</p>
        </div>`;
    }
    return;
  }

  const agentGrid = document.getElementById("staticAgentGrid");
  const resultsCount = document.getElementById("resultsCount");
  const nameInput = document.getElementById("nameInput");
  const updateAgentSearchBtn = document.getElementById("updateAgentSearchBtn");

  const renderAgents = (filteredAgents) => {
    if (!agentGrid) return;
    agentGrid.innerHTML = "";
    const listToRender = filteredAgents || agents;

    if (listToRender.length === 0) {
      agentGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fa-solid fa-user-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                <p style="color: #666;">No agents found matching your search.</p>
            </div>`;
      if (resultsCount) resultsCount.textContent = "0 Agents found";
      return;
    }

    listToRender.forEach((agent, index) => {
      const card = document.createElement("div");
      card.className = "agent-card-static glass-panel animate-slide-up";
      card.style.animationDelay = `${0.1 + index * 0.1}s`;

      card.innerHTML = `
            <div class="agent-card-header">
              <div class="agent-image-wrapper">
                <img src="${agent.photo}" alt="${agent.name}" onerror="this.src='imgs/no-image.avif'" />
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



            <div class="agent-actions">
              <button
                class="btn btn-primary btn-block"
                onclick="openAgentContactModal('${agent.name}', '${agent.email}', '${agent.phone}')"
              >
                Contact Agent
              </button>
              <button
                class="btn btn-outline btn-block"
                onclick="window.location.href='${agent.slug}'"
              >
                View Profile
              </button>
            </div>
         `;
      agentGrid.appendChild(card);
    });

    if (resultsCount)
      resultsCount.textContent = `${listToRender.length} Agents found`;
  };

  // Ensure we get elements again to avoid closure issues if they were not ready
  const getNameVal = () => document.getElementById("nameInput")?.value || "";
  const getLocVal = () => document.getElementById("locInput")?.value || "";

  const filterAgents = () => {
    const nameQuery = getNameVal().toLowerCase();
    const locQuery = getLocVal().toLowerCase();

    const filtered = agents.filter((agent) => {
      const nameMatch = agent.name.toLowerCase().includes(nameQuery);
      const locMatch =
        agent.location?.toLowerCase().includes(locQuery) || false;
      return nameMatch && (locQuery === "" || locMatch);
    });
    renderAgents(filtered);
  };

  // Check URL params for search (only name support for now via URL, location is manual)
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("search"); // from find-agent.html
  const agentParam = urlParams.get("agent"); // alternative

  if (searchParam || agentParam) {
    const query = searchParam || agentParam;
    if (nameInput) nameInput.value = query;
    filterAgents(); // Filter based on set value
  } else {
    renderAgents();
  }

  // Clear Button Logic
  const setupClearBtn = (inputId, btnId, filterFn) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);

    if (!input || !btn) return;

    // Toggle visibility based on input
    const toggleBtn = () => {
      btn.style.display = input.value.trim().length > 0 ? "flex" : "none";
    };

    input.addEventListener("input", toggleBtn);
    // Initial check
    toggleBtn();

    // Clear action
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      input.value = "";
      toggleBtn();
      input.focus();
      if (filterFn) filterFn();
    });
  };

  setupClearBtn("nameInput", "clearNameBtn", filterAgents);
  setupClearBtn("locInput", "clearLocBtn", filterAgents);

  // Event Listeners for Name Search
  if (updateAgentSearchBtn && nameInput) {
    updateAgentSearchBtn.addEventListener("click", () => {
      filterAgents();
    });

    nameInput.addEventListener("keyup", () => {
      filterAgents();
    });
  }

  // Event Listeners for Location Search
  const locInput = document.getElementById("locInput");
  if (locInput) {
    locInput.addEventListener("keyup", () => {
      filterAgents();
    });
    // Also trigger on change for dropdown selection if not covered by mousedown
    locInput.addEventListener("change", () => {
      filterAgents();
    });
  }

  const setupDropdown = (
    inputId,
    listId,
    dataList,
    iconClass,
    limit = Infinity,
  ) => {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    if (!input || !list) return;

    // Flag to track if a selection was just made
    let justSelected = false;

    list.innerHTML = "";
    dataList.forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="${iconClass}"></i> ${item}`;
      li.style.display = "none"; // Initially hide
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        justSelected = true;
        input.value = item;
        list.classList.remove("show");
        // Trigger filter immediately on selection
        filterAgents();
        // Trigger input event to show clear button
        input.dispatchEvent(new Event("input"));
      });
      list.appendChild(li);
    });

    input.addEventListener("focus", () => {
      if (list.children.length > 0) {
        // Show all up to limit on focus if empty
        if (input.value.trim() === "") {
          let count = 0;
          Array.from(list.children).forEach((li) => {
            if (count < limit) {
              li.style.display = "flex";
              count++;
            } else {
              li.style.display = "none";
            }
          });
          list.classList.add("show");
        }
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => list.classList.remove("show"), 200);
    });

    input.addEventListener("input", () => {
      // If a selection was just made, don't show the dropdown
      if (justSelected) {
        justSelected = false;
        return;
      }

      const query = input.value.toLowerCase();
      let count = 0;
      let hasVisibleItems = false;

      Array.from(list.children).forEach((li) => {
        const text = li.textContent.toLowerCase();
        const match = text.includes(query);
        if (match && count < limit) {
          li.style.display = "flex";
          count++;
          hasVisibleItems = true;
        } else {
          li.style.display = "none";
        }
      });

      // Only show the dropdown if there are visible items
      if (hasVisibleItems) {
        list.classList.add("show");
      } else {
        list.classList.remove("show");
      }
    });
  };

  // Get unique locations from agents
  const cities = [...new Set(agents.map((a) => a.location))].filter(Boolean);
  const agentNames = agents.map((a) => a.name);

  setupDropdown(
    "locInput",
    "locSuggestions",
    cities,
    "fa-solid fa-location-dot",
    4, // Limit to 4
  );
  setupDropdown(
    "nameInput",
    "nameSuggestions",
    agentNames,
    "fa-solid fa-user",
    4,
  );
});
