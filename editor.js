const token  = localStorage.getItem('token');
if (!token) window.location.href = 'index.html';

const API = "http://localhost:5000/api";
const encKey = sessionStorage.getItem('enc_key') || 'default-key';

const params = new URLSearchParams(window.location.search);
const noteId = params.get('id');

// SIMPLE encryption (temporary)
function encryptNote(text) {
  return btoa(text);
}

function decryptNote(text) {
  try {
    return atob(text);
  } catch {
    return text;
  }
}

// ================= LOAD NOTE =================
window.onload = async () => {
  if (noteId) {
    document.getElementById('delete-btn').style.display = 'inline-block';

    try {
      const res = await fetch(`${API}/notes/${noteId}`);

      if (!res.ok) throw new Error();

      const note = await res.json();

      document.getElementById('note-title').value =
        decryptNote(note.title || "");

      document.getElementById('note-body').value =
        decryptNote(note.content || "");

    } catch {
      showEditorAlert('Failed to load note.', 'error');
    }
  }
};

// ================= SAVE NOTE =================
async function saveNote() {
  const title   = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-body').value.trim();

  if (!title) return showEditorAlert('Please add a title.', 'error');

  const encTitle   = encryptNote(title);
  const encContent = encryptNote(content);

  try {
    const url    = noteId ? `${API}/notes/${noteId}` : `${API}/notes`;
    const method = noteId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        title: encTitle,
        content: encContent
      })
    });

    if (!res.ok) return showEditorAlert('Failed to save.', 'error');

    showEditorAlert('✓ Note saved!', 'success');
    setTimeout(() => window.location.href = 'dashboard.html', 1000);

  } catch {
    showEditorAlert('Server error.', 'error');
  }
}

// ================= DELETE NOTE =================
async function deleteNote() {
  if (!confirm('Delete this note permanently?')) return;

  await fetch(`${API}/notes/${noteId}`, {
    method: 'DELETE'
  });

  window.location.href = 'dashboard.html';
}

// ================= ALERT =================
function showEditorAlert(msg, type) {
  const el = document.getElementById('editor-alert');
  el.textContent = msg;
  el.className   = `alert ${type}`;
}