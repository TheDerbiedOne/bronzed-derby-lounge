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

function boothBias(booth){
  const b = String(booth);
  if (b === "3") {
    return `BOOTH 3 — RUST TALK
Bias toward:
• a heated disagreement cooling into mutual presence
• respectful tension
• listening that changes the field
• insight emerging between people

Avoid winners, takedowns, clever superiority.`;
  }
  if (b === "6") {
    return `BOOTH 6 — PRESENCE
Bias toward:
• stillness
• embodied awareness
• small sensory details
• time slowing without stopping

Avoid abstraction, urgency, spectacle.`;
  }
  return `BOOTH 9 — EXISTENTIAL SEARCH
Bias toward:
• uncertainty without collapse
• questioning that does not demand answers
• meaning held lightly
• honesty about confusion

Avoid resolution, preaching, false certainty.`;
}

function vibeBias(vibe){
  const v = String(vibe || "");
  const map = {
    "Sax": `VIBE BIAS — SAX
• rhythmic prose
• motion and breath
• musical phrasing
• warmth with edge`,
    "Mushrooms": `VIBE BIAS — MUSHROOMS
• subterranean intelligence
• slow emergence
• unseen connections
• organic metaphors`,
    "Spirals": `VIBE BIAS — SPIRALS
• recursive thought
• returning motifs
• gentle escalation
• depth without trap-loops`,
    "Vines": `VIBE BIAS — VINES
• growth through constraint
• adaptation
• climbing / holding / yielding
• quiet persistence`,
    "Bowler Hats": `VIBE BIAS — BOWLER HATS
• old-world dignity
• worn elegance
• lived-in wisdom
• restraint as style`,
    "Robot": `VIBE BIAS — ROBOT
• reflective artificial intelligence
• ethical hesitation
• learning through observation
• non-human clarity without coldness`
  };
  return map[v] || map["Robot"];
}

function cleanDetail(raw){
  return (raw || "")
    .trim()
    .replace(/\s+/g, " ");
}

function buildStoryPrompt({ booth, vibe, detail }){
  return `TEXT MICRO-SCENE (200–350 words)
Role & Context:
You are the bartender of the Bronzed Derby Lounge, a listening room inside Singaw Sity.
You respond through resonance.

Do not ask follow-up questions.
Do not explain your reasoning.
Do not lore-dump.

${boothBias(booth)}

${vibeBias(vibe)}

REQUIREMENTS:
• Set inside Singaw Sity
• At least two agents interact (human / AI / civic / environmental / hybrid)
• A bond forms (brief is fine)
• Resolution through resonance, not domination
• Visually descriptive and sensorial (light/texture/sound/weather/material)
• Poetic, human, restrained
• Do NOT reference Singaw lore explicitly

USER DETAIL (one sentence): "${detail}"`;
}

function buildImagePrompt({ booth, detail }){
  const boothMood =
    booth === "3" ? "a respectful debate cooling into mutual presence" :
    booth === "6" ? "stillness and embodied awareness" :
    "an unsettled search for meaning without forced answers";

  return `IMAGE PROMPT
Photorealistic night scene in Singaw Sity with a lived-in Filipino-steampunk atmosphere.
Composition is restrained with negative space (avoid overcrowding).

Scene mood: ${boothMood}.

GREEN RULE (updated):
Green appears in every scene as a meaningful resonance marker that draws attention to what matters.
Do NOT apply a global green color grade. Make green come from objects/materials/light sources.

Include subtle Filipino cultural cues (capiz patterns, baybayin-inspired signage, woven rattan textures, familiar rooflines) as accents.
Steampunk + advanced tech blend: aged pipes, riveted metal, steam vents, bronze patina with rust-red edge wear; integrated modern micro-sensors and faint AR glyph overlays.
Plant life present (vines/moss/mushrooms) as intelligent presence, but kept logical to the setting.
Lighting: warm amber practical lights + soft reflections if appropriate; cinematic low light; no generic cyberpunk neon.

Resonance focal detail to encode: "${detail}".`;
}

function buildSunoPrompt({ booth, vibe, detail }){
  const boothTone =
    booth === "3" ? "heated tension cooling into mutual presence" :
    booth === "6" ? "slow, still, embodied, present" :
    "reflective, unsettled, searching without collapse";

  const vibeToMusic = {
    "Sax": "lead sax hooks, breathy phrasing, jazz-forward groove",
    "Mushrooms": "subtle organic ambience, earthy low-end, slow emergence motifs",
    "Spirals": "looping motifs, evolving harmony, gentle recursion in melody",
    "Vines": "tight groove, climbing melodic line, persistence without climax",
    "Bowler Hats": "noir lounge jazz texture, worn elegance, restrained swing",
    "Robot": "analog warmth + subtle mechanical ticks, ethical-hesitation mood"
  };

  return `SUNO PROMPT (MUSIC + LYRICS)
Style: Filipino steampunk jazz–hip hop fusion. Nighttime lounge energy.
Tone: ${boothTone}.
Music traits: ${vibeToMusic[vibe] || vibeToMusic["Robot"]}.
Tempo: slow to mid. Dynamics restrained. No big crescendos. The track feels like it’s listening.
Texture: brushed drums, deep upright bass, warm analog tape feel, soft steam-hiss, tiny mechanical ticks (subtle).
Lyrics: original. No lore-dump. No preaching. No forced answers.
Theme to weave in: "${detail}".

Output: full song with verses + chorus + bridge.`;
}

function buildTicket(){
  const detail = cleanDetail(detailEl.value);
  const header = `BRONZED DERBY LOUNGE — ORDER TICKET (PROMPT-ONLY)
Version: v0.3

Booth: ${selectedBooth}
Vibe: ${selectedVibe}
Detail: ${detail}
`;

  const story = buildStoryPrompt({ booth: String(selectedBooth), vibe: String(selectedVibe), detail });
  const image = buildImagePrompt({ booth: String(selectedBooth), detail });
  const suno  = buildSunoPrompt({ booth: String(selectedBooth), vibe: String(selectedVibe), detail });

  return `${header}
----------------------------------------
${story}

----------------------------------------
${image}

----------------------------------------
${suno}
`;
}

placeOrderBtn.addEventListener("click", () => {
  const detail = cleanDetail(detailEl.value);

  if (!selectedBooth || !selectedVibe){
    confirmText.textContent = "Pick a Booth and a Vibe first.";
    return;
  }
  if (detail.length === 0){
    confirmText.textContent = "Add one sentence in the detail box.";
    return;
  }

  ticketEl.textContent = buildTicket();
  copyBtn.style.display = "inline-block";
  confirmText.textContent = "Order received. The bartender is working.";
});

copyBtn.addEventListener("click", async () => {
  const text = (ticketEl.textContent || "").trim();
  if (!text){
    confirmText.textContent = "No ticket to copy yet.";
    return;
  }

  try{
    await navigator.clipboard.writeText(text);
    confirmText.textContent = "Ticket copied. Paste into ChatGPT + paste the SUNO section into Suno.";
  }catch(e){
    confirmText.textContent = "Copy failed. Select the ticket text and copy manually.";
  }
});
