'use strict';

/* ================================================================
   THE AVIARY — script.js
   Everything (site interactions + game) lives in this one file for
   now. See the TODO block above the GAME module for what's planned
   to move out of here as the project grows.
   ================================================================ */

/* ---------------- small utilities ---------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFieldGuide();
  initAccordion();
  initFacts();
  initGame();
});

/* ================================================================
   NAV
   ================================================================ */
function initNav() {
  const header = qs('.site-header');
  const toggle = qs('#navToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  qsa('.main-nav-mobile a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ================================================================
   FIELD GUIDE
   ================================================================ */
const SPECIES_DATA = [
  {
    name: 'Green Cheek Conure',
    latin: 'Pyrrhura molinae',
    color: '#7fb069',
    accent: '#e76f51',
    stats: { Size: '10 in / 60–80 g', Lifespan: '25–30 yrs', Noise: 'Low–moderate', Talking: 'Rare, a few words', Temperament: 'Cuddly, a bit nippy' },
  },
  {
    name: 'Senegal Parrot',
    latin: 'Poicephalus senegalus',
    color: '#7fb069',
    accent: '#f5a524',
    stats: { Size: '9 in / 120–170 g', Lifespan: '25–30 yrs', Noise: 'Low', Talking: 'Occasional, clear', Temperament: 'Independent, one-person bird' },
  },
  {
    name: 'African Grey',
    latin: 'Psittacus erithacus',
    color: '#a9bba8',
    accent: '#e15554',
    stats: { Size: '13 in / 400–550 g', Lifespan: '40–60 yrs', Noise: 'Moderate', Talking: 'Exceptional, large vocabulary', Temperament: 'Sensitive, needs routine' },
  },
  {
    name: 'Budgerigar',
    latin: 'Melopsittacus undulatus',
    color: '#7fb069',
    accent: '#f5a524',
    stats: { Size: '7 in / 30–40 g', Lifespan: '7–15 yrs', Noise: 'Low', Talking: 'Common, chattery', Temperament: 'Social, does well in pairs' },
  },
  {
    name: 'Sun Conure',
    latin: 'Aratinga solstitialis',
    color: '#f5a524',
    accent: '#e76f51',
    stats: { Size: '12 in / 100–130 g', Lifespan: '25–30 yrs', Noise: 'Very high', Talking: 'Rare', Temperament: 'Bold, affectionate, loud' },
  },
  {
    name: 'Cockatiel',
    latin: 'Nymphicus hollandicus',
    color: '#eab84f',
    accent: '#e76f51',
    stats: { Size: '12–13 in / 80–100 g', Lifespan: '16–25 yrs', Noise: 'Low–moderate', Talking: 'Whistles more than words', Temperament: 'Gentle, easygoing' },
  },
];

function birdSilhouette(color, accent) {
  return `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 8c11 0 19 9 19 21 0 9-4 17-10 22l3 5-8-3c-1.3.2-2.6.3-4 .3-11 0-19-9-19-21S21 8 32 8Z" fill="${color}"/>
    <path d="M32 34c2 6 1.5 13-1 19-2-.6-3.5-4-4-9-.6-4 1-8 5-10Z" fill="${accent}"/>
    <circle cx="38" cy="22" r="2.4" fill="#16261c"/>
  </svg>`;
}

function initFieldGuide() {
  const grid = qs('#speciesGrid');
  if (!grid) return;

  grid.innerHTML = SPECIES_DATA.map((s, i) => `
    <div class="species-card" data-index="${i}" tabindex="0" role="button"
         aria-pressed="false" aria-label="${s.name}, tap for care details">
      <div class="species-card-inner">
        <div class="species-face species-front">
          ${birdSilhouette(s.color, s.accent)}
          <div>
            <h3>${s.name}</h3>
            <p class="species-latin">${s.latin}</p>
          </div>
          <p class="species-tap-hint">Tap for details →</p>
        </div>
        <div class="species-face species-back">
          <h3>${s.name}</h3>
          <ul class="species-stats">
            ${Object.entries(s.stats).map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');

  const flip = (card) => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(isFlipped));
  };

  qsa('.species-card', grid).forEach((card) => {
    card.addEventListener('click', () => flip(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip(card);
      }
    });
  });
}

/* ================================================================
   CARE ACCORDION
   ================================================================ */
const CARE_DATA = [
  {
    title: '1. Diet',
    body: `A seed-only diet is the single biggest cause of early parrot death. Aim for 60–70% high-quality pellet, with fresh vegetables, a little fruit, and seed kept as an occasional treat rather than a staple. Avoid avocado, chocolate, caffeine, and anything high in salt.`,
  },
  {
    title: '2. Enrichment',
    body: `Parrots are as intelligent as a 3–5 year old child and need daily problem-solving, not just toys sitting in the cage. Rotate foraging puzzles, shreddable material, and out-of-cage time. A bird with nothing to do will find something — usually your furniture.`,
  },
  {
    title: '3. Social time',
    body: `Most parrot species are flock animals in the wild, so a bird left alone all day is a stressed bird. Budget real, attentive time every day — talking, training, or just being in the same room counts. Bonded birds that get ignored often start screaming or plucking.`,
  },
  {
    title: '4. Health signs',
    body: `Fluffed feathers for long periods, a change in droppings, tail-bobbing while breathing, or sitting at the bottom of the cage are all reasons to call an avian vet the same day — birds hide illness until it's advanced. Yearly checkups catch problems early.`,
  },
];

function initAccordion() {
  const wrap = qs('#careAccordion');
  if (!wrap) return;

  wrap.innerHTML = CARE_DATA.map((item, i) => `
    <div class="accordion-item" data-index="${i}">
      <button class="accordion-trigger" aria-expanded="false" aria-controls="panel-${i}">
        <span>${item.title}</span>
        <span class="accordion-icon">+</span>
      </button>
      <div class="accordion-panel" id="panel-${i}">
        <div class="accordion-panel-inner"><p>${item.body}</p></div>
      </div>
    </div>
  `).join('');

  qsa('.accordion-trigger', wrap).forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = qs('.accordion-panel', item);
      const isOpen = item.classList.contains('is-open');

      // close any other open item for a cleaner single-focus reveal
      qsa('.accordion-item.is-open', wrap).forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          qs('.accordion-trigger', openItem).setAttribute('aria-expanded', 'false');
          qs('.accordion-panel', openItem).style.maxHeight = null;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });
}

/* ================================================================
   FUN FACTS CAROUSEL
   ================================================================ */
const FACTS_DATA = [
  'Parrots are one of the few animals that can dance in time with a musical beat — a skill closely tied to their ability to mimic sound.',
  "A cockatiel's crest position is basically a mood ring: flat and tight can mean fear, straight up can mean curiosity or startlement.",
  'Some African Greys have shown they can learn well over a hundred words and use them in the right context, not just repeat sound.',
  'Wild budgerigars in Australia can travel in flocks of hundreds and cover long distances chasing rain and fresh seed.',
  "A parrot's beak keeps growing throughout its life, which is why chew toys aren't optional — they wear the beak down naturally.",
  'Green cheek conures sleep on one leg with the other tucked into their feathers to conserve body heat.',
  'Parrots are zygodactyl — two toes point forward and two point back, giving them a grip that works almost like a hand.',
  'A stressed or bored parrot may pluck its own feathers, a behavior far more common in captivity than in the wild.',
];

function initFacts() {
  const textEl = qs('#factText');
  const dotsEl = qs('#factDots');
  if (!textEl) return;

  let index = 0;

  dotsEl.innerHTML = FACTS_DATA.map((_, i) =>
    `<button aria-label="Show fact ${i + 1}" data-index="${i}"></button>`
  ).join('');

  function render() {
    textEl.textContent = FACTS_DATA[index];
    qsa('button', dotsEl).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  function go(delta) {
    index = (index + delta + FACTS_DATA.length) % FACTS_DATA.length;
    render();
  }

  qs('#factPrev').addEventListener('click', () => go(-1));
  qs('#factNext').addEventListener('click', () => go(1));
  dotsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    index = Number(btn.dataset.index);
    render();
  });

  render();
}

/* ================================================================
   GAME — The Aviary
   ----------------------------------------------------------------
   TODO (future sessions):
   - split this module out into its own file(s) once the site grows
   - implement the vet-visit action (currently disabled on purpose)
   - rework the forage mini-game (timing / difficulty curve)
   - tune tick/decay rates against real playtesting
   ================================================================ */

const STAT_KEYS = ['hunger', 'hydration', 'enrichment', 'bond', 'health'];

const STAT_META = {
  hunger:     { label: 'Hunger',     color: 'var(--mango)' },
  hydration:  { label: 'Hydration',  color: '#5fb5d9' },
  enrichment: { label: 'Enrich.',    color: 'var(--good)' },
  bond:       { label: 'Bond',       color: 'var(--cheek)' },
  health:     { label: 'Health',     color: '#c98bd6' },
};

const TICK_MS = 5000;          // how often stats decay
const DECAY = { hunger: 3, hydration: 4, enrichment: 2 };
const MOLT_CHANCE_PER_TICK = 0.02;
const SCREAM_THRESHOLD = 25;   // any of hunger/hydration/bond below this can trigger screaming

function birdPortrait(kind) {
  // kind: 'conure' | 'senegal'
  if (kind === 'conure') {
    return `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 8c11 0 19 9 19 21 0 9-4 17-10 22l3 5-8-3c-1.3.2-2.6.3-4 .3-11 0-19-9-19-21S21 8 32 8Z" fill="#7fb069"/>
      <path d="M32 8c-8 0-14 6-16 15 5-6 12-9 18-9 8 0 15 4 19 10-1-9-9-16-21-16Z" fill="#5f9450"/>
      <path d="M32 34c2 6 1.5 13-1 19-2-.6-3.5-4-4-9-.6-4 1-8 5-10Z" fill="#e76f51"/>
      <circle cx="38" cy="22" r="2.4" fill="#16261c"/>
      <circle cx="39" cy="21" r="0.8" fill="#fff"/>
      <path d="M46 25c3 .6 5 2.4 5.5 5-2-.6-4-.6-6.5 0 .2-1.8.5-3.5 1-5Z" fill="#1e3327"/>
    </svg>`;
  }
  return `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 10c10 0 17 8 17 19 0 8-3.5 15-9 19.5l2.5 4.5-7-2.5c-1.1.2-2.3.3-3.5.3-10 0-17-8-17-19S22 10 32 10Z" fill="#a9bba8"/>
    <path d="M32 30c1.5 8 3 15 1 22-5-4-8-11-7-19 1-2 3.5-3 6-3Z" fill="#f5a524"/>
    <path d="M20 20c-2 4-2.5 9-1 13-3-2-5-6-5-10.5 2-1.5 4-2 6-2.5Z" fill="#7fb069"/>
    <circle cx="38" cy="24" r="2.3" fill="#16261c"/>
    <circle cx="39" cy="23" r="0.8" fill="#fff"/>
    <path d="M45 27c3 .6 5 2.4 5.5 5-2-.6-4-.6-6.5 0 .2-1.8.5-3.5 1-5Z" fill="#8a6a1a"/>
  </svg>`;
}

const BIRDS = [
  { id: 'kiwi',   name: 'Kiwi',   species: 'Green Cheek Conure', kind: 'conure' },
  { id: 'mango',  name: 'Mango',  species: 'Green Cheek Conure', kind: 'conure' },
  { id: 'ziggy',  name: 'Ziggy',  species: 'Senegal Parrot',     kind: 'senegal' },
  { id: 'olive',  name: 'Olive',  species: 'Senegal Parrot',     kind: 'senegal' },
];

let gameState = {};   // id -> { hunger, hydration, enrichment, bond, health, molting, screaming }
let tickHandle = null;
let activeForageBird = null;
let forageTimerHandle = null;

function initGame() {
  const board = qs('#gameBoard');
  if (!board) return;

  BIRDS.forEach((b) => {
    gameState[b.id] = {
      hunger: randInt(60, 90),
      hydration: randInt(60, 90),
      enrichment: randInt(50, 85),
      bond: randInt(55, 85),
      health: 90,
      molting: false,
      screaming: false,
    };
  });

  renderBoard();
  addLog('The aviary door swings open. Four birds, one keeper — let\'s get to work.');

  tickHandle = setInterval(gameTick, TICK_MS);

  qs('#gameBoard').addEventListener('click', onBoardClick);
}

function renderBoard() {
  const board = qs('#gameBoard');
  board.innerHTML = BIRDS.map((b) => renderBirdCard(b)).join('');
}

function renderBirdCard(b) {
  const s = gameState[b.id];
  const statusClass = s.screaming ? 'status-upset' : (needsAttention(s) ? 'status-needs' : 'status-content');
  const statusLabel = s.screaming ? 'Screaming' : (needsAttention(s) ? 'Needs care' : 'Content');

  return `
  <article class="bird-card ${s.molting ? 'is-molting' : ''} ${s.screaming ? 'is-screaming' : ''}" data-id="${b.id}">
    <div class="bird-head">
      <div class="bird-portrait">${birdPortrait(b.kind)}</div>
      <div>
        <h3 class="bird-name">${b.name}${s.molting ? ' 🪶' : ''}</h3>
        <p class="bird-species">${b.species}</p>
      </div>
      <span class="bird-status ${statusClass}">${statusLabel}</span>
    </div>

    <div class="bird-stats">
      ${STAT_KEYS.map((k) => statRow(k, s[k])).join('')}
    </div>

    <div class="bird-actions">
      <button data-action="feed" data-id="${b.id}">Feed</button>
      <button data-action="water" data-id="${b.id}">Water</button>
      <button data-action="forage" data-id="${b.id}">Forage box</button>
      <button data-action="bond" data-id="${b.id}">Spend time</button>
      <button data-action="vet" data-id="${b.id}" disabled title="Coming in a future update">Vet visit</button>
    </div>
  </article>`;
}

function statRow(key, value) {
  const meta = STAT_META[key];
  const color = value < 30 ? 'var(--danger)' : value < 55 ? 'var(--warn)' : meta.color;
  return `
    <div class="stat-row">
      <span class="stat-label">${meta.label}</span>
      <span class="stat-track"><span class="stat-fill" style="width:${value}%; background:${color};"></span></span>
      <span class="stat-value">${Math.round(value)}</span>
    </div>`;
}

function needsAttention(s) {
  return s.hunger < 40 || s.hydration < 40 || s.enrichment < 35 || s.bond < 35;
}

/* ---------- ticking / decay ---------- */
function gameTick() {
  BIRDS.forEach((b) => {
    const s = gameState[b.id];

    s.hunger = clamp(s.hunger - DECAY.hunger);
    s.hydration = clamp(s.hydration - DECAY.hydration);
    s.enrichment = clamp(s.enrichment - DECAY.enrichment);

    // bond drifts down slowly, faster if the bird is neglected elsewhere
    const neglectPenalty = (s.hunger < 30 || s.hydration < 30) ? 2 : 0;
    s.bond = clamp(s.bond - (1 + neglectPenalty));

    // molting: random onset, resolves on its own after it runs its course
    if (!s.molting && Math.random() < MOLT_CHANCE_PER_TICK) {
      s.molting = true;
      s.moltTicksLeft = randInt(4, 8);
      addLog(`${b.name} is starting to molt — expect a few loose feathers.`);
    } else if (s.molting) {
      s.moltTicksLeft -= 1;
      if (s.moltTicksLeft <= 0) {
        s.molting = false;
        addLog(`${b.name} has finished molting. Fresh feathers all round.`);
      }
    }

    // health follows the average of everything else, molting costs a little extra
    const baseHealth = (s.hunger + s.hydration + s.enrichment + s.bond) / 4;
    s.health = clamp(Math.round(baseHealth - (s.molting ? 8 : 0)));

    // screaming: triggered by real neglect, calms down once care is given
    const wasScreaming = s.screaming;
    s.screaming = s.hunger < SCREAM_THRESHOLD || s.hydration < SCREAM_THRESHOLD || s.bond < SCREAM_THRESHOLD;
    if (s.screaming && !wasScreaming) {
      addLog(`${b.name} starts screaming for attention!`);
    }
  });

  renderBoard();
}

/* ---------- actions ---------- */
function onBoardClick(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn || btn.disabled) return;
  const { action, id } = btn.dataset;
  const bird = BIRDS.find((b) => b.id === id);
  if (!bird) return;

  if (action === 'feed') doFeed(bird);
  if (action === 'water') doWater(bird);
  if (action === 'bond') doBond(bird);
  if (action === 'forage') openForage(bird);
  // 'vet' intentionally does nothing yet — the button is disabled
}

function doFeed(bird) {
  const s = gameState[bird.id];
  s.hunger = clamp(s.hunger + 30);
  addLog(`You fed ${bird.name}.`);
  toast(`${bird.name} chows down 🌰`);
  renderBoard();
}

function doWater(bird) {
  const s = gameState[bird.id];
  s.hydration = clamp(s.hydration + 30);
  addLog(`You refreshed ${bird.name}'s water.`);
  toast(`${bird.name} takes a drink 💧`);
  renderBoard();
}

function doBond(bird) {
  const s = gameState[bird.id];
  s.bond = clamp(s.bond + 18);
  s.enrichment = clamp(s.enrichment + 6);
  addLog(`You spent some quiet time with ${bird.name}.`);
  toast(`${bird.name} leans into your hand`);
  renderBoard();
}

/* ---------- forage mini-game ---------- */
function openForage(bird) {
  activeForageBird = bird;
  const s = gameState[bird.id];

  const panel = qs('#foragePanel');
  const grid = qs('#forageGrid');
  panel.hidden = false;
  qs('#forageBirdName').textContent = bird.name;

  const TILE_COUNT = 12;
  const SEED_COUNT = 4;
  const seedPositions = new Set();
  while (seedPositions.size < SEED_COUNT) {
    seedPositions.add(randInt(0, TILE_COUNT - 1));
  }

  grid.innerHTML = Array.from({ length: TILE_COUNT }, (_, i) =>
    `<button class="forage-tile" data-index="${i}" data-seed="${seedPositions.has(i)}" aria-label="Leaf ${i + 1}">🍃</button>`
  ).join('');

  let found = 0;
  let timeLeft = 10;
  qs('#forageScore').textContent = `Seeds found: 0 / ${SEED_COUNT}`;
  qs('#forageTimer').textContent = `${timeLeft.toFixed(1)}s`;

  clearInterval(forageTimerHandle);
  forageTimerHandle = setInterval(() => {
    timeLeft -= 0.1;
    qs('#forageTimer').textContent = `${Math.max(0, timeLeft).toFixed(1)}s`;
    if (timeLeft <= 0) endForage(found, SEED_COUNT);
  }, 100);

  grid.onclick = (e) => {
    const tile = e.target.closest('.forage-tile');
    if (!tile || tile.classList.contains('is-found') || tile.disabled) return;

    tile.disabled = true;
    if (tile.dataset.seed === 'true') {
      tile.classList.add('is-found');
      tile.textContent = '🌰';
      found += 1;
      qs('#forageScore').textContent = `Seeds found: ${found} / ${SEED_COUNT}`;
      if (found >= SEED_COUNT) endForage(found, SEED_COUNT);
    } else {
      tile.textContent = '🍂';
    }
  };
}

function endForage(found, total) {
  clearInterval(forageTimerHandle);
  const panel = qs('#foragePanel');
  const bird = activeForageBird;
  if (!bird) { panel.hidden = true; return; }

  const s = gameState[bird.id];
  const ratio = found / total;
  const enrichGain = Math.round(10 + ratio * 25);
  const bondGain = Math.round(ratio * 12);

  s.enrichment = clamp(s.enrichment + enrichGain);
  s.bond = clamp(s.bond + bondGain);

  addLog(`${bird.name} found ${found}/${total} seeds in the forage box (+${enrichGain} enrichment).`);
  toast(found === total ? `${bird.name} cleaned out the forage box!` : `${bird.name} enjoyed the forage box`);

  panel.hidden = true;
  activeForageBird = null;
  renderBoard();
}

/* ---------- log + toast ---------- */
function addLog(message) {
  const log = qs('#gameLog');
  if (!log) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const li = document.createElement('li');
  li.innerHTML = `<span class="log-time">${time}</span>${message}`;
  log.appendChild(li);

  // keep the log from growing forever
  while (log.children.length > 40) log.removeChild(log.firstChild);
}

let toastTimeout = null;
function toast(message) {
  let el = qs('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  requestAnimationFrame(() => el.classList.add('is-visible'));
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove('is-visible'), 1800);
}
