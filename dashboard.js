// ================= AUTH =================
const token = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

document.getElementById('nav-username').textContent =
  'Hello, ' + (localStorage.getItem('name') || 'User');

// ================= CONFIG =================
const API = "http://localhost:5000/api";

// Load notes on page load
window.onload = loadNotes;

// ================= LOAD NOTES =================
async function loadNotes() {
  try {
    const res = await fetch(`${API}/notes`, {
      headers: { Authorization: token }
    });

    if (!res.ok) throw new Error("Request failed");

    const notes = await res.json();
    console.log("Notes:", notes);

    renderNotes(notes);

  } catch (err) {
    console.error("Failed to load notes:", err);
  }
}

// ================= RENDER NOTES =================
function renderNotes(notes) {
  const grid = document.getElementById('notes-grid');
  const empty = document.getElementById('empty-state');

  if (!notes.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = '';

  notes.forEach(note => {
    const card = document.createElement('div');
    card.className = 'note-card';

    card.innerHTML = `
      <div class="note-card-lock">🔒</div>
      <div class="note-card-title">${note.title || "No Title"}</div>
      <div class="note-card-preview">${note.content || ""}</div>
      <div class="note-card-date">
        ${new Date(note.updatedAt || Date.now()).toLocaleDateString()}
      </div>
    `;

    card.onclick = () => {
      window.location.href = `editor.html?id=${note._id}`;
    };

    grid.appendChild(card);
  });
}

// ================= SEARCH =================
function filterNotes() {
  const q = document.getElementById('search-input').value.toLowerCase();

  const cards = document.querySelectorAll('.note-card');

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(q) ? 'block' : 'none';
  });
}