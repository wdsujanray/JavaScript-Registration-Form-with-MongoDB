document.querySelectorAll(".password-toggle").forEach((button) => {
  const input = document.getElementById(button.getAttribute("aria-controls"));

  if (!input) {
    console.error("Password toggle input was not found.");
    return;
  }

  button.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    button.setAttribute("aria-pressed", String(!isVisible));
    button.setAttribute(
      "aria-label",
      isVisible ? "Show password" : "Hide password",
    );
  });
});
