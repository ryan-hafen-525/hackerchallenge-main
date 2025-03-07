async function getAPIBaseURL() {
    try {
        const response = await fetch('/config.json'); // Fetch API URL dynamically
        const config = await response.json();
        return config.WORKER_API;
    } catch (error) {
        console.error("Error fetching API URL:", error);
        return null;
    }
}

// ✅ Register User
async function registerUser() {
    const apiURL = await getAPIBaseURL();
    if (!apiURL) return;

    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    
    if (!username || !password) {
        document.getElementById("register-result").innerText = "❌ Both fields are required.";
        return;
    }

    try {
        const response = await fetch(apiURL + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        document.getElementById("register-result").innerText = data.success ? "✅ Registration successful!" : "❌ " + data.message;
    } catch (error) {
        console.error("Registration Error:", error);
    }
}

// ✅ Login User
async function loginUser() {
    const apiURL = await getAPIBaseURL();
    if (!apiURL) return;

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    if (!username || !password) {
        document.getElementById("login-result").innerText = "❌ Both fields are required.";
        return;
    }

    try {
        const response = await fetch(apiURL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem("userId", data.userId);
            document.getElementById("login-result").innerText = "✅ Login successful!";
            setTimeout(() => window.location.href = "challenge1.html", 2000);
        } else {
            document.getElementById("login-result").innerText = "❌ " + data.message;
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
}

// ✅ Fetch Leaderboard
async function fetchLeaderboard() {
    const apiURL = await getAPIBaseURL();
    if (!apiURL) return;

    try {
        const response = await fetch(apiURL + "/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard.");

        const leaderboard = await response.json();
        const leaderboardBody = document.getElementById("leaderboard-body");
        leaderboardBody.innerHTML = "";

        leaderboard.forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${index + 1}</td><td>${player.username}</td><td>${player.score}</td>`;
            leaderboardBody.appendChild(row);
        });
    } catch (error) {
        console.error("Leaderboard Error:", error);
    }
}

// ✅ Ensure script.js loads properly before calling functions
document.addEventListener("DOMContentLoaded", async function () {
    console.log("Checking if fetchLeaderboard is defined...");
    if (typeof fetchLeaderboard === "function") {
        await fetchLeaderboard();
    } else {
        console.error("fetchLeaderboard is not defined!");
    }
});
