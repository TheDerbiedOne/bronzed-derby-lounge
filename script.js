let selectedBooth = null;
let selectedVibe = null;

function setActive(containerId, datasetKey, value) {
  const container = document.getElementById(containerId);
  const buttons = container.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset[datasetKey] === value);
  });
}

document.getElementById("booths").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  selectedBooth = btn.dataset.booth;
  setActive("booths", "booth", selectedBooth);
});

document.getElementById("vibes").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  selectedVibe = btn.dataset.vibe;
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

  document.getElementById("ticket").textContent = ticketText;
  document.getElementById("copyBtn").style.display = "inline-block";
  document.getElementById("status").style.display = "block";
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const text = document.getElementById("ticket").textContent;
  try {
    await navigator.clipboard.writeText(text);
    alert("Ticket copied. Paste it into the Bronzed Derby chat.");
  } catch {
    alert("Couldn’t auto-copy. Manually select the ticket text and copy it.");
  }
});
