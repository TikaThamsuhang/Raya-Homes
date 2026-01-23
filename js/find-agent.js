document.addEventListener("DOMContentLoaded", async () => {
  // --- Search Logic ---
  const tabBtns = document.querySelectorAll(".tab-btn");
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");
  const searchForm = document.querySelector(".single-search-form");
  const searchLabel = document.querySelector(".floating-label-search");
  const agentSuggestionsList = document.querySelector(".agent-suggestions ul");

  // Fetch agents data
  let agentsData = [];
  try {
    const response = await fetch("agent/js/agents-data.json");
    agentsData = await response.json();
  } catch (error) {
    console.error("Error loading agents data:", error);
  }

  // Populate Agent Suggestions initially
  const populateAgentSuggestions = (filterText = "") => {
    if (!agentSuggestionsList) return;

    agentSuggestionsList.innerHTML = "";
    const filteredAgents = filterText
      ? agentsData.filter((agent) =>
          agent.name.toLowerCase().includes(filterText.toLowerCase()),
        )
      : agentsData.slice(0, 5); // Show first 5 by default

    filteredAgents.forEach((agent) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-user"></i> ${agent.name}`;
      li.addEventListener("click", () => {
        searchInput.value = agent.name;
        searchSuggestions.classList.remove("show");
      });
      agentSuggestionsList.appendChild(li);
    });

    // Show/Hide section based on results
    const agentSection = document.querySelector(".agent-suggestions");
    if (agentSection) {
      agentSection.style.display =
        filteredAgents.length > 0 && currentMode === "agent" ? "block" : "none";
    }
  };

  const tabConfig = {
    location: {
      label: "City, Zip, Address, Property Name",
      placeholders: [
        "Beverly Hills, CA",
        "New York, NY 10021",
        "Miami Beach, FL",
        "Los Angeles, CA",
        "San Francisco, CA",
      ],
    },
    agent: {
      label: "Agent Name",
      placeholders:
        agentsData.length > 0
          ? agentsData.slice(0, 5).map((a) => a.name)
          : ["Sarah Jenkins", "Michael Chang", "Emily Rodriguez"],
    },
  };

  let currentMode = "location";

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mode = btn.dataset.tab;
      currentMode = mode;

      // Update label text
      if (searchLabel && tabConfig[mode]) {
        searchLabel.textContent = tabConfig[mode].label;
      }

      // Toggle suggestion groups
      const locationSuggestions = document.querySelector(
        ".location-suggestions",
      );
      const agentSuggestions = document.querySelector(".agent-suggestions");

      if (mode === "location") {
        locationSuggestions.style.display = "block";
        agentSuggestions.style.display = "none";
      } else {
        locationSuggestions.style.display = "none";
        agentSuggestions.style.display = "block";
        populateAgentSuggestions(searchInput.value);
      }

      // Clear input
      searchInput.value = "";

      // Restart typing animation with new placeholders
      startTypingAnimation();
    });
  });

  searchInput.addEventListener("focus", () => {
    searchSuggestions.classList.add("show");
    if (currentMode === "agent") {
      populateAgentSuggestions(searchInput.value);
    }
  });

  searchInput.addEventListener("input", () => {
    searchSuggestions.classList.add("show");
    if (currentMode === "agent") {
      populateAgentSuggestions(searchInput.value);
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !searchForm.contains(e.target) &&
      !searchSuggestions.contains(e.target)
    ) {
      searchSuggestions.classList.remove("show");
    }
  });

  const suggestionItems = searchSuggestions.querySelectorAll("li");
  suggestionItems.forEach((item) => {
    item.addEventListener("click", () => {
      searchInput.value = item.textContent.trim().replace(/\s+/g, " ");
      searchSuggestions.classList.remove("show");
    });
  });

  // --- Recent Searches Logic ---
  const RECENT_SEARCHES_KEY = "raya_recent_searches";
  const recentSearchesList = document.getElementById("recentSearchesList");

  const loadRecentSearches = () => {
    if (!recentSearchesList) return;

    const searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]",
    );
    recentSearchesList.innerHTML = "";

    if (searches.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No recent searches";
      li.style.color = "#999";
      li.style.pointerEvents = "none";
      recentSearchesList.appendChild(li);
      return;
    }

    searches.forEach((term) => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ${term}`;
      li.addEventListener("click", () => {
        searchInput.value = term;
        // Trigger search or just fill input?
        // Let's just fill for now to allow editing
        // Optional: submit immediately
        // searchForm.dispatchEvent(new Event('submit'));
      });
      recentSearchesList.appendChild(li);
    });
  };

  const saveRecentSearch = (term) => {
    if (!term) return;
    let searches = JSON.parse(
      localStorage.getItem(RECENT_SEARCHES_KEY) || "[]",
    );

    // Remove if exists to bubble to top
    searches = searches.filter((s) => s.toLowerCase() !== term.toLowerCase());

    // Add to front
    searches.unshift(term);

    // Limit to 5
    if (searches.length > 5) searches.length = 5;

    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  };

  // Load on start
  loadRecentSearches();

  // Handle hero search form submission
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue) {
      // Save to recent searches
      saveRecentSearch(searchValue);

      // Check which tab is active
      const activeTab = document.querySelector(".tab-btn.active");
      const mode = activeTab ? activeTab.dataset.tab : "agent";

      if (mode === "agent") {
        // Navigate to AGENT LISTINGS page
        window.location.href = `agent-listings.html?search=${encodeURIComponent(
          searchValue,
        )}`;
      } else {
        // Navigate to home valuation page (or property search)
        window.location.href = `agent-listings.html?address=${encodeURIComponent(
          searchValue,
        )}`;
      }
    }
  });

  // Typing Animation for Placeholder (Find Agent Page)
  const typingInputAgent = document.getElementById("searchInput");
  let currentTermIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;
  let deletingSpeed = 40;
  let pauseBeforeDelete = 2000;
  let pauseBeforeType = 500;
  let typingTimeout = null;

  function typeEffect() {
    // Don't type if input has focus or has value
    if (
      document.activeElement === typingInputAgent ||
      typingInputAgent.value.trim() !== ""
    ) {
      typingTimeout = setTimeout(typeEffect, 1000);
      return;
    }

    // Refresh placeholders if data loaded late
    if (
      currentMode === "agent" &&
      agentsData.length > 0 &&
      tabConfig.agent.placeholders.length < 5
    ) {
      tabConfig.agent.placeholders = agentsData.slice(0, 5).map((a) => a.name);
    }

    const searchTerms = tabConfig[currentMode].placeholders;
    const currentTerm = searchTerms[currentTermIndex];

    if (!isDeleting) {
      // Typing
      typingInputAgent.setAttribute(
        "placeholder",
        currentTerm.substring(0, currentCharIndex + 1),
      );
      currentCharIndex++;

      if (currentCharIndex === currentTerm.length) {
        // Finished typing, pause then start deleting
        isDeleting = true;
        typingTimeout = setTimeout(typeEffect, pauseBeforeDelete);
        return;
      }
    } else {
      // Deleting
      typingInputAgent.setAttribute(
        "placeholder",
        currentTerm.substring(0, currentCharIndex - 1),
      );
      currentCharIndex--;

      if (currentCharIndex === 0) {
        // Finished deleting, move to next term
        isDeleting = false;
        currentTermIndex = (currentTermIndex + 1) % searchTerms.length;
        typingTimeout = setTimeout(typeEffect, pauseBeforeType);
        return;
      }
    }

    typingTimeout = setTimeout(
      typeEffect,
      isDeleting ? deletingSpeed : typingSpeed,
    );
  }

  function startTypingAnimation() {
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Reset animation state
    currentTermIndex = 0;
    currentCharIndex = 0;
    isDeleting = false;

    // Clear placeholder and start fresh
    typingInputAgent.setAttribute("placeholder", "");

    // Start typing animation after a short delay
    typingTimeout = setTimeout(typeEffect, 500);
  }

  // Start initial animation
  if (typingInputAgent) {
    startTypingAnimation();
  }
});
