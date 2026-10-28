const form = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");
const button = document.getElementById("loginButton");
const statusBox = document.getElementById("loginStatus");
const loading = document.getElementById("loginLoading");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusBox.textContent = "";
  statusBox.className = "status";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    password.length === 0 ||
    password.length > 72
  ) {
    statusBox.textContent = "Enter a valid email address and password.";
    statusBox.className = "status failure";
    return;
  }

  button.disabled = true;
  loading.hidden = false;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Login failed.");
    }

    sessionStorage.setItem(
      "domRegistrationProfile",
      JSON.stringify(responseData.user),
    );
    passwordInput.value = "";
    window.location.replace("/profile.html");
  } catch (error) {
    statusBox.textContent =
      error.message === "Failed to fetch"
        ? "Cannot reach the server. Check that the server is running."
        : error.message;
    statusBox.className = "status failure";
  } finally {
    loading.hidden = true;
    button.disabled = false;
  }
});
