// Agent Contact Modal Functions
function openAgentContactModal(agentName, agentEmail, agentPhone) {
  const modal = document.getElementById("agentContactModal");
  const modalAgentName = document.getElementById("modalAgentName");
  const modalAgentEmail = document.getElementById("modalAgentEmail");
  const modalAgentPhone = document.getElementById("modalAgentPhone");

  // Set agent details
  modalAgentName.textContent = `Contact ${agentName}`;
  modalAgentEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${agentEmail}`;
  modalAgentPhone.innerHTML = `<i class="fa-solid fa-phone"></i> ${agentPhone}`;

  // Show modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeAgentContactModal() {
  const modal = document.getElementById("agentContactModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("agentContactModal");
  if (event.target === modal) {
    closeAgentContactModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAgentContactModal();
  }
});

// Handle Modal Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const modalForm = document.querySelector(".modal-contact-form");
  if (modalForm) {
    modalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = modalForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML; // Check logic for innerHTML vs innerText if icon is used

      // Mock Data
      const nameInput = document.getElementById("modal_name");
      const nameVal = nameInput ? nameInput.value : "Visitor";

      btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;

      setTimeout(() => {
        // Use Shared Popup Logic (Duplicated here for now to avoid dependency issues)
        const name = nameVal;

        // Create Popup
        const popup = document.createElement("div");
        popup.className = "success-popup-modal";
        popup.innerHTML = `
                    <button class="popup-close-btn"><i class="fa-solid fa-xmark"></i></button>
                    <div class="popup-checkmark-circle">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h3 class="popup-title">Message Sent!</h3>
                    <p class="popup-desc">Thanks for reaching out, ${
                      name || "Visitor"
                    }.<br>The agent will get back to you shortly.</p>
                    <div class="popup-progress-bar"></div>
                `;

        document.body.appendChild(popup);

        // Auto Remove
        let removed = false;
        const removePopup = () => {
          if (removed) return;
          removed = true;
          popup.style.animation = "popupFadeOut 0.4s forwards";
          setTimeout(() => popup.remove(), 400);
        };

        const timer = setTimeout(removePopup, 3000);

        // Close Button
        popup
          .querySelector(".popup-close-btn")
          .addEventListener("click", () => {
            clearTimeout(timer);
            removePopup();
          });

        // Close Modal & Reset
        closeAgentContactModal();
        modalForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }
});
