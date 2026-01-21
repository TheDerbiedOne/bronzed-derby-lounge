let selectedBooth = null;
let selectedVibe = null;

const boothButtons = document.querySelectorAll("#booths button");
const vibeButtons = document.querySelectorAll("#vibes button");

const detailEl = document.getElementById("detail");
const ticketEl = document.getElementById("ticket");
const placeOrderBtn = document.getElementById("placeOrder");
const copyBtn = document.getElementById("copyBtn");
const confirmText = document.getElementById("confirmText");

function setActive(buttons, target){
  buttons.forEach(b => b.classList.remove("active"));
  target.classList.add("active");
}

boothButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBooth = btn.dataset.booth;
    setActive(boothButtons, btn);
    confirmText.textContent = "";
  });
});

vibeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedVibe = btn.dataset.vibe;
    setActive(vibeButtons, btn);
    confirmText.textContent = "";
  });
});

function buildTicket(){
  const detail = (detailEl.value || "").trim();
  return `Booth: ${selectedBooth || "(pick one)"}\nVibe: ${selectedVibe || "(pick one)"}\nDetail: ${detail || "(add one sentence)"}`;
}

placeOrderBtn.addEventListener("click", () => {
  const detail = (detailEl.value || "").trim();

  if(!selectedBooth || !selectedVibe){
    confirmText.textContent = "Pick a Booth and a Vibe first.";
    return;
  }
  if(detail.length === 0){
    confirmText.textContent = "Add one sentence in the detail box.";
    return;
  }

  const ticket = buildTicket();
  ticketEl.textContent = ticket;

  copyBtn.style.display = "inline-block";
  confirmText.textContent = "Order received. The bartender is working.";
});

copyBtn.addEventListener("click", async () => {
  const text = ticketEl.textContent.trim();
  if(!text){
    confirmText.textContent = "No ticket to copy yet.";
    return;
  }

  try{
    await navigator.clipboard.writeText(text);
    confirmText.textContent = "Ticket copied. Paste it into ChatGPT (or your House Generator prompt).";
  }catch(e){
    // Fallback if clipboard permission fails
    confirmText.textContent = "Copy failed. Select the ticket text and copy manually.";
  }
});
