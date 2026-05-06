const API = "http://localhost:5000/api";

// ================= GLOBAL OTP =================
let generatedOTP = null;

// ================= TAB SWITCH =================
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1))
  );

  document.querySelectorAll('.panel').forEach((p, i) =>
    p.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'signup' && i === 1))
  );
}

// ================= TOGGLE PASSWORD =================
function togglePass(id, el) {
  const input = document.getElementById(id);
  input.type = input.type === 'password' ? 'text' : 'password';
  el.textContent = input.type === 'password' ? '👁' : '🙈';
}

// ================= LOGIN WITH OTP =================
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-pass').value.trim();

  if (!email || !password) {
    return alert("Please fill all fields");
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      return alert("Invalid email or password");
    }

    const data = await res.json();

    // Save temp data
    localStorage.setItem("tempToken", data.token);
    localStorage.setItem("name", data.name || "User");

    // ================= GENERATE OTP =================
    generatedOTP = Math.floor(100000 + Math.random() * 900000);

    alert("Your OTP is: " + generatedOTP); // demo purpose

    const userOTP = prompt("Enter the OTP sent to you:");

    if (parseInt(userOTP) === generatedOTP) {
      // ✅ OTP correct → finalize login
      localStorage.setItem("token", data.token);

      alert("Login successful");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid OTP");
    }

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

// ================= SIGNUP =================
async function handleSignup() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-pass').value.trim();

  if (!fname || !lname || !email || !password) {
    return alert("Please fill all fields");
  }

  if (password.length < 6) {
    return alert("Password must be at least 6 characters");
  }

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: fname + " " + lname,
        email,
        password
      })
    });

    if (!res.ok) {
      return alert("Signup failed");
    }

    alert("Account created! Please login.");
    switchTab('login');

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}