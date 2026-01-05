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
