const FREE_URL = "http://localhost:3000/freePredictions";
const PREMIUM_URL = "http://localhost:3000/premiumPredictions";
const ADMIN_PASSWORD = "admin123"; 
let isAdmin = false;
let isPremiumUser = false;

function loadFreePredictions() {
  fetch(FREE_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("freePredictions");
      list.innerHTML = "";
      data.forEach(pred => {
        const card = document.createElement("div");
        card.className = "prediction-card";
        card.innerHTML = `
          <h4>${pred.match}</h4>
          <p>Tip: ${pred.tip}</p>
          <span>Date: ${pred.date}</span>
        `;
        list.appendChild(card);
      });
    });
}


function loadPremiumPredictions() {
  fetch(PREMIUM_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("premiumPredictions");
      list.innerHTML = "";
      data.forEach(pred => {
        const card = document.createElement("div");
        card.className = "prediction-card";
        card.innerHTML = `
          <h4>${pred.match}</h4>
          <p>Tip: ${isPremiumUser ? pred.tip : "<span class='blur'>Premium Tip</span>"}</p>
          <span>Date: ${pred.date}</span>
        `;
        list.appendChild(card);
      });
    });
}


document.getElementById("adminLoginForm").addEventListener("submit", e => {
  e.preventDefault();
  const password = document.getElementById("adminPassword").value;
  if (password === ADMIN_PASSWORD) {
    isAdmin = true;
    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("adminLoginMsg").textContent = "Access granted.";
  } else {
    document.getElementById("adminLoginMsg").textContent = "Incorrect password.";
  }
});


document.getElementById("addPredictionForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!isAdmin) return alert("Only admins can add predictions.");

  const match = document.getElementById("matchInput").value;
  const tip = document.getElementById("tipInput").value;
  const type = document.getElementById("typeInput").value;
  const date = document.getElementById("dateInput").value;

  const newPrediction = { match, tip, date };

  fetch(type === "free" ? FREE_URL : PREMIUM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPrediction)
  })
    .then(res => res.json())
    .then(() => {
      alert("Prediction added!");
      loadFreePredictions();
      loadPremiumPredictions();
      document.getElementById("addPredictionForm").reset();
    });
});


document.getElementById("userLoginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("userEmail").value;
  const password = document.getElementById("userPassword").value;

  
  if (email && password) {
    localStorage.setItem("token", "user-token");
    isPremiumUser = true;
    alert("User login successful. Premium access granted.");
    loadPremiumPredictions();
  } else {
    alert("Invalid login");
  }
});


function subscribeToPremium() {
  alert("Subscription successful! Premium access granted.");
  isPremiumUser = true;
  localStorage.setItem("token", "premium-user-token");
  loadPremiumPredictions();
}


loadFreePredictions();
loadPremiumPredictions();
