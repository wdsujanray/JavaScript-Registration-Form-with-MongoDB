const form = document.getElementById("registerForm");
const statusBox = document.getElementById("status");
const submitButton = document.getElementById("submitButton");
const welcome = document.getElementById("welcome");

const fields = ["name", "email", "phone", "password", "message"];

function showError(field, message = "") {
  document.getElementById(`${field}Error`).textContent = message;
}

function validateForm() {
  const data = Object.fromEntries(
    fields.map((field) => {
      const value = document.getElementById(field).value;
      return [field, field === "password" ? value : value.trim()];
    }),
  );

  const errors = {};

  if (data.name.length < 2 || data.name.length > 80) {
    errors.name = "Name must contain 2–80 characters.";
  }

  if (
    data.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!/^[+0-9().\-\s]{7,20}$/.test(data.phone)) {
    errors.phone = "Enter a valid contact number.";
  }

  if (
    data.password.length < 8 ||
    data.password.length > 72 ||
    !/[a-z]/.test(data.password) ||
    !/[A-Z]/.test(data.password) ||
    !/[0-9]/.test(data.password)
  ) {
    errors.password =
      "Use 8–72 characters with uppercase, lowercase and a number.";
  }

  if (data.message.length > 500) {
    errors.message = "Message must be 500 characters or less.";
  }

  fields.forEach((field) => showError(field, errors[field] || ""));

  return { data, errors };
}

// Validate while typing.
fields.forEach((field) => {
  document.getElementById(field).addEventListener("input", () => {
    const { errors } = validateForm();
    if (Object.keys(errors).length === 0) {
      statusBox.textContent = "";
      statusBox.className = "status";
    }
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { data, errors } = validateForm();

  if (Object.keys(errors).length > 0) {
    statusBox.textContent = "Please correct the errors above.";
    statusBox.className = "status failure";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Registering…";
  statusBox.textContent = "";
  document.getElementById("welcomeName").textContent =
    data.name.split(/\s+/)[0];
  welcome.hidden = false;

  try {
    // Password goes to the backend over the request body.
    // The backend hashes it before saving it in MongoDB.
    const response = await fetch("./api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error(
        "Registration server was not found. Run npm start and open http://localhost:3000.",
        { cause: error },
      );
    }

    if (!response.ok) {
      throw new Error(result.message || "Registration failed.");
    }

    // Keep only the non-sensitive profile data for the separate profile page.
    sessionStorage.setItem(
      "domRegistrationProfile",
      JSON.stringify(result.user),
    );
    document.getElementById("password").value = "";
    window.location.replace("./profile.html");
  } catch (error) {
    statusBox.textContent =
      error.message === "Failed to fetch"
        ? "Cannot reach the registration server. Run npm start and open http://localhost:3000."
        : error.message;

    statusBox.className = "status failure";
  } finally {
    welcome.hidden = true;
    submitButton.disabled = false;
    submitButton.textContent = "Register & generate profile ↗";
  }
});
