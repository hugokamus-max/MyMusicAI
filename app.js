const catalogs = {
  inicio: [
    { title: "Todo de Ti", artist: "Rauw Alejandro", mood: "Subir el ánimo", search: "Todo de Ti Rauw Alejandro" },
    { title: "Ojitos Lindos", artist: "Bad Bunny, Bomba Estéreo", mood: "Un buen momento", search: "Ojitos Lindos Bad Bunny Bomba Estereo" },
    { title: "Brillas", artist: "León Larregui", mood: "Relajarme", search: "Brillas Leon Larregui" },
    { title: "Golden Hour", artist: "JVKE", mood: "Descubrir", search: "Golden Hour JVKE" }
  ],
  concentrarme: [
    { title: "Weightless", artist: "Marconi Union", mood: "Concentración", search: "Weightless Marconi Union" },
    { title: "Ylang Ylang", artist: "FKJ", mood: "Sin distracciones", search: "Ylang Ylang FKJ" },
    { title: "Friday Morning", artist: "Khruangbin", mood: "Ritmo suave", search: "Friday Morning Khruangbin" },
    { title: "A Walk", artist: "Tycho", mood: "Enfoque tranquilo", search: "A Walk Tycho" }
  ],
  "subir el ánimo": [
    { title: "Todo de Ti", artist: "Rauw Alejandro", mood: "Buena energía", search: "Todo de Ti Rauw Alejandro" },
    { title: "La Vida Es Un Carnaval", artist: "Celia Cruz", mood: "Celebrar", search: "La Vida Es Un Carnaval Celia Cruz" },
    { title: "Vivir Mi Vida", artist: "Marc Anthony", mood: "Volver a sonreír", search: "Vivir Mi Vida Marc Anthony" },
    { title: "Levitating", artist: "Dua Lipa", mood: "A todo ritmo", search: "Levitating Dua Lipa" }
  ],
  relajarme: [
    { title: "Brillas", artist: "León Larregui", mood: "Bajar un cambio", search: "Brillas Leon Larregui" },
    { title: "Sunset Lover", artist: "Petit Biscuit", mood: "Atardecer", search: "Sunset Lover Petit Biscuit" },
    { title: "Best Part", artist: "Daniel Caesar, H.E.R.", mood: "Suave y cálida", search: "Best Part Daniel Caesar HER" },
    { title: "Holocene", artist: "Bon Iver", mood: "Respirar", search: "Holocene Bon Iver" }
  ],
  "descubrir algo nuevo": [
    { title: "Tadow", artist: "Masego, FKJ", mood: "Un hallazgo", search: "Tadow Masego FKJ" },
    { title: "Amárrame", artist: "Mon Laferte, Juanes", mood: "Ritmo latino", search: "Amarrame Mon Laferte Juanes" },
    { title: "Borderline", artist: "Tame Impala", mood: "Otra perspectiva", search: "Borderline Tame Impala" },
    { title: "Agua", artist: "Bomba Estéreo", mood: "Un sonido distinto", search: "Agua Bomba Estereo" }
  ]
};

const $ = (selector) => document.querySelector(selector);
const trackGrid = $("#trackGrid");
const favoritesGrid = $("#favoritesGrid");
const themeSelect = $("#themeSelect");
const FAVORITES_KEY = "ritmo-favorites";
let currentMood = "inicio";
let currentPrompt = "canciones populares";
let currentTracks = null;
let rotation = 0;
let toastTimer;

const savedTheme = localStorage.getItem("ritmo-theme") || "night";
document.body.dataset.theme = savedTheme;
themeSelect.value = savedTheme;
themeSelect.addEventListener("change", () => {
  document.body.dataset.theme = themeSelect.value;
  localStorage.setItem("ritmo-theme", themeSelect.value);
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function getFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((track) => track && typeof track.title === "string" && typeof track.artist === "string" && typeof track.search === "string") : [];
  } catch {
    return [];
  }
}

function toggleFavorite(track) {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex((saved) => saved.search === track.search);
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
    showToast("Quitamos la canción de tus favoritos.");
  } else {
    favorites.unshift({ title: track.title, artist: track.artist, mood: track.mood, search: track.search });
    showToast("Guardamos la canción en este dispositivo.");
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    showToast("No pudimos guardar el favorito. Revisa el espacio disponible en tu navegador.");
  }
  renderTracks();
  renderFavorites();
}

function trackCard(track, index) {
  const isFavorite = getFavorites().some((saved) => saved.search === track.search);
  return `
    <article class="track-card">
      <div class="cover cover-${(index % 4) + 1}"><span class="cover-index">R / 0${index + 1}</span><span class="cover-word">${escapeHtml(track.title)}</span><button class="favorite-button${isFavorite ? " is-saved" : ""}" data-action="favorite" data-query="${escapeHtml(track.search)}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? "Quitar de" : "Guardar en"} favoritos">${isFavorite ? "♥" : "♡"}</button></div>
      <div class="track-meta"><div><h3 title="${escapeHtml(track.title)}">${escapeHtml(track.title)}</h3><p>${escapeHtml(track.artist)}</p></div><span class="track-time">♫</span></div>
      <div class="track-actions"><span class="track-tag">${escapeHtml(track.mood || "Favorito")}</span><button class="listen-button" data-action="listen" data-query="${escapeHtml(track.search)}">Escuchar ↗</button></div>
      <div class="track-subactions"><button data-action="video" data-query="${escapeHtml(track.search)}">▷ Videoclip</button><button data-action="karaoke" data-query="${escapeHtml(track.search)}">♫ Karaoke</button></div>
    </article>`;
}

function openYouTubeMusic(query) {
  window.open(`https://music.youtube.com/search?q=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
}

function openYouTube(query) {
  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
}

function runMusicSearch(type = "music") {
  const input = $("#musicSearchInput");
  const query = input.value.trim();
  if (!query) {
    input.focus();
    showToast("Escribe una canción, artista o género para buscar.");
    return;
  }
  if (type === "video") openYouTube(`${query} official music video`);
  else if (type === "karaoke") openYouTube(`${query} karaoke instrumental`);
  else openYouTubeMusic(query);
}

function showToast(message) {
  let toast = $(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function renderTracks() {
  const list = [...(currentTracks || catalogs[currentMood] || catalogs.inicio)];
  if (rotation) list.push(...list.splice(0, Math.min(rotation % list.length, list.length)));
  trackGrid.innerHTML = list.map(trackCard).join("");
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesGrid.innerHTML = favorites.length
    ? favorites.map(trackCard).join("")
    : '<p class="empty-state">Todavía no guardaste canciones. Pulsa “♡ Guardar” en una selección para armar tu biblioteca.</p>';
}

function handleTrackAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const query = button.dataset.query;
  if (button.dataset.action === "favorite") {
    const track = [...getFavorites(), ...(currentTracks || catalogs[currentMood] || catalogs.inicio), ...Object.values(catalogs).flat()].find((item) => item.search === query);
    if (track) toggleFavorite(track);
    return;
  }
  if (button.dataset.action === "listen") openYouTubeMusic(query);
  if (button.dataset.action === "video") openYouTube(`${query} official music video`);
  if (button.dataset.action === "karaoke") openYouTube(`${query} karaoke instrumental`);
}

function setMood(mood) {
  currentMood = mood;
  currentPrompt = mood === "inicio" ? "canciones populares" : mood;
  currentTracks = null;
  const names = { inicio: "Tu punto de partida", concentrarme: "Música para concentrarte", "subir el ánimo": "Una dosis de buena energía", relajarme: "Un momento para bajar un cambio", "descubrir algo nuevo": "Nuevos sonidos para ti" };
  $("#recommendTitle").textContent = names[mood] || names.inicio;
  renderTracks();
  document.querySelectorAll(".mood-card").forEach((card) => card.classList.toggle("selected", card.dataset.mood === mood));
  $("#recommendSection").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.querySelectorAll(".mood-card").forEach((button) => button.addEventListener("click", () => setMood(button.dataset.mood)));

trackGrid.addEventListener("click", handleTrackAction);
favoritesGrid.addEventListener("click", handleTrackAction);

$("#videosButton").addEventListener("click", () => openYouTube(`${currentPrompt || "canciones populares"} official music video`));
$("#karaokeButton").addEventListener("click", () => openYouTube(`${currentPrompt || "canciones populares"} karaoke instrumental`));
$("#refreshButton").addEventListener("click", () => {
  rotation += 1;
  renderTracks();
  showToast("Renovamos la selección. Elige una canción para escucharla.");
});
$("#moreMoods").addEventListener("click", () => showToast("Pronto podrás explorar más estados de ánimo."));
$("#musicSearchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  runMusicSearch("music");
});
document.querySelectorAll("[data-search-type]").forEach((button) => button.addEventListener("click", () => runMusicSearch(button.dataset.searchType)));

$("#navExplore").addEventListener("click", () => {
  $("#quickSearch").scrollIntoView({ behavior: "smooth" });
  $("#musicSearchInput").focus({ preventScroll: true });
});
$("#navVideos").addEventListener("click", () => $("#extrasSection").scrollIntoView({ behavior: "smooth" }));
$("#navKaraoke").addEventListener("click", () => $("#extrasSection").scrollIntoView({ behavior: "smooth" }));
$("#navLibrary").addEventListener("click", () => $("#favoritesSection").scrollIntoView({ behavior: "smooth" }));
$("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => $("#sidebar").classList.remove("open")));

renderTracks();
renderFavorites();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}));
}

