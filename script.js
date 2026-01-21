let selectedBooth = null;
let selectedVibe = null;

function setActive(containerId, key, value) {
  const container = document.getElementById(containerId);
  [...container.querySelectorAll("button")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset[key] === value);
  });
}

document.getElementById("booths").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  selectedBooth = e.target.dataset.booth;
  setActive("booths", "booth", selectedBooth);
});

document.getElementById("vibes").addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;
  selectedVibe = e.target.dataset.vibe;
  setActive("vibes", "vibe", selectedVibe);
});

document.getElementById("placeOrder").addEventListener("click", () => {
  const detail = document.getElementById("detail").value.trim();

  if (!selectedBooth || !selectedVibe || !detail) {
    alert("Pick a booth, pick a vibe, and add one sentence.");
    return;
  }

  const ticketText =
`Booth: ${selectedBooth}
Vibe: ${selectedVibe}
Detail: ${detail}`;

  const ticket = document.getElementById("ticket");
  ticket.textContent = ticketText;

  const copyBtn = document.getElementById("copyBtn");
  copyBtn.style.display = "inline-block";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = document.getElementById("ticket").textContent;
  await navigator.clipboard.writeText(text);
  alert("Ticket copied. Paste it into the Bronzed Derby chat.");
});
