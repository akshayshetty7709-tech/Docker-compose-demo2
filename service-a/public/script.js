const grid = document.getElementById("videoGrid");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  sidebar.classList.toggle("collapsed");
});

const gradients = [
  "linear-gradient(135deg,#f2a154,#c8672c)",
  "linear-gradient(135deg,#7cc4a3,#3d8067)",
  "linear-gradient(135deg,#c893d6,#7a4c8a)",
  "linear-gradient(135deg,#6fa8dc,#33608f)",
  "linear-gradient(135deg,#e0785c,#a34632)",
  "linear-gradient(135deg,#8fbf6f,#4f7a37)"
];

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function renderVideos(videos) {
  grid.innerHTML = "";
  videos.forEach((v, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">
        <div class="thumb-art" style="background:${gradients[i % gradients.length]}">${v.title}</div>
        <span class="duration">${v.duration}</span>
        <div class="scrub"><div class="scrub-fill"></div></div>
      </div>
      <div class="meta">
        <div class="meta-avatar" style="background:${gradients[(i + 2) % gradients.length]}">${initials(v.channel)}</div>
        <div class="meta-text">
          <p class="title">${v.title}</p>
          <p class="channel">${v.channel}</p>
          <p class="stats">${v.views} views · ${v.posted}</p>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

fetch("/api/videos")
  .then(res => res.json())
  .then(renderVideos)
  .catch(() => {
    grid.innerHTML = `<p style="color:#9aa4b8">Couldn't load videos. Is the API running?</p>`;
  });

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelector(".chip.active")?.classList.remove("active");
    chip.classList.add("active");
  });
});
