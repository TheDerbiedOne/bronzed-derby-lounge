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
  if(b === "3"){
    return `BOOTH 3 — RUST TALK
Bias toward: heated disagreement cooling into mutual presence; respectful tension; listening that changes the field; insight emerging between people.
Avoid winners, takedowns, superiority.`;
  }
  if(b === "6"){
    return `BOOTH 6 — PRESENCE
Bias toward: stillness; embodied awareness; small sensory details; time slowing without stopping.
Avoid abstraction, urgency, spectacle.`;
  }
  return `BOOTH 9 — EXISTENTIAL SEARCH
Bias toward: uncertainty without collapse; questioning without demanding answers; meaning held lightly; honest confusion.
Avoid preaching, forced resolution, false certainty.`;
}

function vibeBias(vibe){
  const v = String(vibe || "");
  const map = {
    "Sax": `VIBE — SAX
Rhythmic prose; motion and breath; musical phrasing; warmth with edge.`,
    "Mushrooms": `VIBE — MUSHROOMS
Subterranean intelligence; slow emergence; unseen connections; organic metaphors.`,
    "Spirals": `VIBE — SPIRALS
Recursive thought; returning motifs; gentle escalation; depth without trap-loops.`,
    "Vines": `VIBE — VINES
Growth through constraint; adaptation; climbing/holding/yielding; quiet persistence.`,
    "Bowler Hats": `VIBE — BOWLER HATS
Old-world dignity; worn elegance; lived-in wisdom; restraint as style.`,
    "Robot": `VIBE — ROBOT
Reflective AI; ethical hesitation; learning through observation; non-human clarity without coldness.`
  };
  return map[v] || map["Robot"];
}

function buildImagePrompt({ booth, vibe, detail }){
  // Meaningful green is a resonance marker, not a global green grade.
  // Add subtle Filipino cues; steampunk + advanced tech; lived-in; restrained.
  const boothMood =
    booth === "3" ? "a respectful debate cooling into presence" :
    booth === "6" ? "stillness and embodied awareness" :
    "an unsettled search for meaning without forced answers";

  return `IMAGE PROMPT
Photorealistic night scene in Singaw Sity, lived-in Filipino-steampunk atmosphere. Composition is restrained with negative space (not crowded).
Scene mood: ${boothMood}.
Meaningful green appears ONLY as a resonance marker that draws attention to one meaningful object/detail (not a green color correction).
Include subtle Filipino cultural cues (e.g., capiz-window patterns, baybayin-inspired signage, woven rattan textures, local roofline motifs) as accents, not costume.
Steampunk + advanced tech blend: aged pipes, riveted metal, steam vents, brass/bronze patina with rust-red edge wear; integrated modern micro-sensors and faint AR glyph overlays.
Plant life present in-scene as intelligent presence (vines/moss/mushrooms) but kept logical to the setting.
Lighting: warm amber practical lights + soft wet reflections if appropriate; cinematic low light; no generic cyberpunk neon.
User detail to encode as the resonance focal point: "${detail}".`;
}

function buildSunoPrompt({ booth, vibe, detail }){
  const boothTone =
    booth === "3" ? "tense-but-respectful, debate cooling into mutual presence" :
    booth === "6" ? "slow, still, embodied, present" :
    "reflective, unsettled, searching without collapse";

  const vibeMap = {
    "Sax": {
      instruments: "lead saxophone, upright bass, brushed drums, warm tape-saturated keys",
      lyricStyle: "rhythmic phrasing, breath-forward lines, warmth with edge"
    },
    "Mushrooms": {
      instruments: "breathy sax or clarinet, deep bass, soft percussion, subtle kulintang-like metallic tones, organic ambience",
      lyricStyle: "slow emergence, unseen connections, grounded metaphors"
    },
    "Spirals": {
      instruments: "looping motifs, sax/keys, restrained hip hop drum textures, evolving harmony, gentle polyrhythms",
      lyricStyle: "returning motifs, recursion, escalation without climax"
    },
    "Vines": {
      instruments: "tight groove, organic percussion, melodic sax, small mechanical ticks, warm bass",
      lyricStyle: "growth through constraint, adaptation, quiet persistence"
    },
    "Bowler Hats": {
      instruments: "noir lounge jazz feel, sax, upright bass, brushed drums, soft vinyl crackle",
      lyricStyle: "worn elegance, restraint, lived-in wisdom"
    },
    "Robot": {
      instruments: "Filipino steampunk jazz–hip hop fusion: analog warmth + subtle mechanical clicks, sax as lead voice, deep bass, brushed/lo-fi drums",
      lyricStyle: "ethical hesitation, reflective clarity, human-adjacent warmth"
    }
  };

  const v = vibeMap[vibe] || vibeMap["Robot"];

  // Keep lyrics original, singable, and aligned to the Booth theme.
  // No naming the vibe explicitly.
  return `SUNO PROMPT (MUSIC + LYRICS)
Genre/Style: Filipino steampunk jazz–hip hop fusion. Nighttime lounge energy. Tone: ${boothTone}.
Instrumentation: ${v.instruments}. Add soft steam-hiss texture and occasional tiny mechanical ticks (not harsh).
Tempo: slow to mid. Dynamics restrained. No big crescendos. The track feels like it’s listening.
Vocal performance: intimate mic, honest delivery, not preachy. ${v.lyricStyle}.
Theme to weave in (from the order): "${detail}".
Setting flavor: lived-in Singaw Sity (subtle, no lore-dump). Include a faint hint of Filipino rhythm sensibility without imitation of any existing song.

LYRICS (original)
[Verse 1]
I came in carrying questions like coins,
cold in my fist, loud in my joints.
Rain on the bronze, steam in the beams,
I wanted a map, but I got my own dreams.

[Pre-Chorus]
Hold up—listen.
Not to reply.
Listen like the room has a pulse,
like the city can tell when we lie.

[Chorus]
No crowns in this corner, no winners tonight,
just the hush where the edge turns into light.
If the answer won’t come, let the asking stay true,
let it breathe in the space between me and you.

[Verse 2]
The machines don’t judge, they measure the tone,
and I watch how the silence makes meaning its own.
We don’t fix it in words, we don’t seal it tight—
we turn toward each other and soften the fight.

[Bridge]
A small green flicker, not shouting—just near,
pointing at the moment I finally hear.

[Final Chorus]
No crowns in this corner, no winners tonight,
just the hush where the edge turns into light.
If the answer won’t come, let the asking stay true,
let it breathe in the space between me and you.`;
}

function buildStoryPrompt({ booth, vibe, detail }){
  return `TEXT MICRO-SCENE (200–350 words)
Role: You are the bartender of the Bronzed Derby Lounge, a listening room inside Singaw Sity. You respond through resonance.
Do not ask follow-up questions. Do not explain reasoning. Do not lore-dump.

${boothBias(booth)}

${vibeBias(vibe)}

REQUIREMENTS:
- Set inside Singaw Sity
- At least two agents (human/AI/environment/civic/hybrid) interacting
- A bond forms (brief is fine)
- Conflict resolves through resonance (alignment/listening/timing), not domination
- Visually descriptive and sensorial (light/texture/sound/weather/material)
- Poetic, human, restrained
- Do NOT reference Singaw lore explicitly

USER DETAIL TO INCLUDE (1 sentence): "${detail}"`;
}

function buildTicket(){
  const detail = (detailEl.value || "").trim();

  const header = `BRONZED DERBY LOUNGE — ORDER TICKET (PROMPT-ONLY)\nVersion: v0.2\n\nBooth: ${selectedBooth}\nVibe: ${selectedVibe}\nDetail: ${detail}\n`;

  const story = buildStoryPrompt({ booth: String(selectedBooth), vibe: String(selectedVibe), detail });
  const image = buildImagePrompt({ booth: String(selectedBooth), vibe: String(selectedVibe), detail });
  const suno  = buildSunoPrompt({ booth: String(selectedBooth), vibe: String(selectedVibe), detail });

  return `${header}\n----------------------------------------\n${story}\n\n----------------------------------------\n${image}\n\n----------------------------------------\n${suno}\n`;
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
    confirmText.textContent = "Ticket copied. Paste it into ChatGPT, and paste the SUNO section into Suno.";
  }catch(e){
    confirmText.textContent = "Copy failed. Select the ticket text and copy manually.";
  }
});
