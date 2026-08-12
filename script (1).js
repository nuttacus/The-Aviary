// TODO: split this into modules (birds.js, ui.js, game-loop.js) once it stops changing so much
// TODO: replace magic numbers below with a difficulty config object

const SPECIES = {
  conure: { label: 'Green Cheek Conure', bodyColor:'#4f8f6d', cheek:'#e8674a', screamsWhenNeglected:true },
  senegal: { label: 'Senegal Parrot', bodyColor:'#8a6a2f', cheek:'#f2a93b', screamsWhenNeglected:false }
};

let birds = [
  mkBird('Mango',   'conure', {bond:55}),
  mkBird('Pip',      'conure', {bond:80, bondedPair:true}),
  mkBird('Juniper',  'conure', {bond:50}),
  mkBird('Baobab',   'senegal',{bond:45}),
];

function mkBird(name, species, opts={}){
  return {
    name, species,
    hunger: 70, hydration: 75, enrichment: 60, bond: opts.bond ?? 50, health: 85,
    molting: false, moltTicks:0,
    screaming: false,
    bondedPair: !!opts.bondedPair,
  };
}

let selected = birds[0];
let tickHandle = null;

function clamp(n){ return Math.max(0, Math.min(100, n)); }

function log(msg, cls=''){
  console.log('[aviary]', msg); // leaving this in for now, useful for debugging
  const el = document.getElementById('log');
  const line = document.createElement('div');
  if(cls) line.className = cls;
  line.textContent = msg;
  el.prepend(line);
  while(el.children.length > 40) el.removeChild(el.lastChild);
}

function moodOf(b){
  const avg = (b.hunger + b.hydration + b.enrichment + b.bond + b.health) / 5;
  if(b.screaming) return 'Frustrated';
  if(b.molting) return 'Molting';
  if(avg > 75) return 'Happy';
  if(avg > 50) return 'Okay';
  if(avg > 30) return 'Concerned';
  return 'Unwell';
}

// quick and dirty bird shape, works but definitely placeholder art
function birdSVG(b){
  const s = SPECIES[b.species];
  const avg = (b.hunger + b.hydration + b.enrichment + b.bond + b.health) / 5;
  const opacity = b.molting ? 0.65 : Math.max(0.5, avg/100);
  return `
  <svg width="64" height="56" viewBox="0 0 72 64" style="opacity:${opacity}">
    <ellipse cx="36" cy="38" rx="20" ry="22" fill="${s.bodyColor}"/>
    <circle cx="36" cy="16" r="13" fill="${s.bodyColor}"/>
    <circle cx="30" cy="14" r="2.4" fill="#202020"/>
    <path d="M20 15 Q12 17 18 22 Q22 20 24 16 Z" fill="${s.cheek}"/>
    <ellipse cx="24" cy="16" rx="5" ry="4" fill="${s.cheek}" opacity="0.85"/>
    <path d="M46 40 Q64 42 60 56 Q48 54 44 44 Z" fill="${s.cheek}" opacity="0.9"/>
    ${b.molting ? `<circle cx="50" cy="20" r="1.6" fill="#eee"/><circle cx="55" cy="30" r="1.4" fill="#eee"/>` : ''}
  </svg>`;
}

function render(){
  renderAviary();
  renderStats();
  renderActions();
  renderForage();
}

function renderAviary(){
  const el = document.getElementById('aviary');
  el.innerHTML = birds.map(b => `
    <div class="bird-card ${b===selected?'active':''}" data-name="${b.name}">
      <div class="perch-name">${b.name}</div>
      <div class="species">${SPECIES[b.species].label}</div>
      <div class="mood-tag">${moodOf(b)}</div>
      ${birdSVG(b)}
      ${b.screaming ? '<div class="scream-badge">SCREAMING</div>' : (b.molting ? '<div class="molt-badge">MOLTING</div>' : '')}
    </div>
  `).join('');
  [...el.children].forEach((card,i) => card.onclick = () => { selected = birds[i]; render(); });
}

function statRow(label, val, cls){
  return `<div class="stat-row">
    <div class="label"><span>${label}</span><span>${Math.round(val)}</span></div>
    <div class="bar"><div class="${cls}" style="width:${val}%"></div></div>
  </div>`;
}

function renderStats(){
  const b = selected;
  document.getElementById('stats').innerHTML = `
    <h3 style="font-size:0.8rem;color:var(--muted);margin:0 0 8px;">${b.name}'s stats</h3>
    ${statRow('Hunger', b.hunger, 'fill-hunger')}
    ${statRow('Hydration', b.hydration, 'fill-hydration')}
    ${statRow('Enrichment', b.enrichment, 'fill-enrichment')}
    ${statRow('Bond', b.bond, 'fill-bond')}
    ${statRow('Health', b.health, 'fill-health')}
  `;
}

function renderActions(){
  const b = selected;
  const acts = [
    {label:'Feed chop', fn:()=>feed(b,'chop')},
    {label:'Feed pellets', fn:()=>feed(b,'pellets')},
    {label:'Refill water', fn:()=>water(b)},
    {label:'Talk & pet', fn:()=>bondUp(b)},
    {label:'Flight time', fn:()=>flightTime(b)},
    {label:'Clean cage', fn:()=>cleanCage(b)},
    // stubbed - want to add a vet-visit event chain but haven't built it yet
    {label:'Vet visit (soon)', fn:null, comingSoon:true},
  ];
  document.getElementById('actions').innerHTML = acts.map((a,i)=>
    `<button class="act ${a.comingSoon?'coming-soon':''}" data-i="${i}" ${a.comingSoon?'disabled':''}>${a.label}</button>`
  ).join('');
  [...document.getElementById('actions').children].forEach((btn,i)=>{
    if(acts[i].fn) btn.onclick = () => { acts[i].fn(); render(); };
  });
}

function feed(b, kind){
  if(kind==='chop'){ b.hunger = clamp(b.hunger+25); b.health = clamp(b.health+4); log(`${b.name} enjoyed a chop bowl.`, 'good'); }
  else { b.hunger = clamp(b.hunger+15); log(`${b.name} pecked through the pellet mix.`); }
  if(b.screaming && b.hunger > 50){ b.screaming = false; }
}
function water(b){ b.hydration = clamp(b.hydration+30); log(`${b.name}'s water refreshed.`); }
function bondUp(b){
  const gain = b.molting ? 4 : 10;
  b.bond = clamp(b.bond + gain);
  log(b.molting ? `${b.name} tolerates a gentle chat, but is touchy today (molting).` : `${b.name} chirped happily during your chat.`, 'good');
}
function flightTime(b){
  if(b.bond < 35){
    b.enrichment = clamp(b.enrichment+8);
    log(`${b.name} stayed guarded during flight time — bond's still building.`);
  } else {
    b.enrichment = clamp(b.enrichment+22);
    b.bond = clamp(b.bond+3);
    log(`${b.name} had a great flight around the room.`, 'good');
  }
}
function cleanCage(b){ b.health = clamp(b.health+15); log(`Cage freshened up for ${b.name}.`); }

// forage mini-game — this whole thing needs a rework, the 8-cell grid
// was just for testing and never got revisited
let forageState = [];
function newForage(){
  forageState = Array.from({length:8}, () => Math.random() < 0.35);
}
newForage();

function renderForage(){
  const grid = document.getElementById('forageGrid');
  grid.innerHTML = forageState.map((hasTreat, i) => `<button class="forage-cell" data-i="${i}">?</button>`).join('');
  [...grid.children].forEach((cell,i) => {
    cell.onclick = () => {
      cell.classList.add('found');
      cell.disabled = true;
      if(forageState[i]){
        cell.textContent = 'treat';
        selected.enrichment = clamp(selected.enrichment + 6);
        log(`${selected.name} found a treat foraging!`, 'good');
        renderStats();
      } else {
        cell.textContent = '·';
      }
      if([...grid.children].every(c => c.disabled)){
        setTimeout(() => { newForage(); renderForage(); }, 500);
      }
    };
  });
}

// decay + random events tick
// TODO: tune these rates, 4s ticks are just for demoing, way too fast for a real session
function tick(){
  birds.forEach(b => {
    const moltMod = b.molting ? 1.4 : 1;
    b.hunger = clamp(b.hunger - 3*moltMod);
    b.hydration = clamp(b.hydration - 2.5);
    b.enrichment = clamp(b.enrichment - 2.2*moltMod);
    b.bond = clamp(b.bond - 0.6);
    if(b.hunger < 20 || b.enrichment < 20) b.health = clamp(b.health - 1.5);

    if(!b.molting && Math.random() < 0.01){
      b.molting = true; b.moltTicks = 0;
      log(`${b.name} has started a molt — expect some moodiness.`, 'alert');
    } else if(b.molting){
      b.moltTicks++;
      if(b.moltTicks > 25){ b.molting = false; log(`${b.name}'s molt has finished.`, 'good'); }
    }

    const s = SPECIES[b.species];
    if(s.screamsWhenNeglected){
      if(!b.screaming && (b.hunger < 25 || b.enrichment < 20)){
        b.screaming = true;
        log(`${b.name} is screaming for attention!`, 'alert');
      } else if(b.screaming && b.hunger > 45 && b.enrichment > 35){
        b.screaming = false;
      }
    }
  });
  render();
}

log('game booted, tick interval running every 4s (debug speed)', 'debug');
render();
tickHandle = setInterval(tick, 4000);
