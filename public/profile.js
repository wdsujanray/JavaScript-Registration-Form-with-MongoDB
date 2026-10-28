const profileKey = "domRegistrationProfile";
const profileData = sessionStorage.getItem(profileKey);

if (!profileData) {
  window.location.replace("/login.html");
} else {
  let user;

  try {
    user = JSON.parse(profileData);
  } catch (error) {
    console.error("Unable to read the saved profile:", error);
    sessionStorage.removeItem(profileKey);
    window.location.replace("/login.html");
  }

  if (
    !user ||
    typeof user !== "object" ||
    typeof user.name !== "string" ||
    typeof user.email !== "string"
  ) {
    sessionStorage.removeItem(profileKey);
    window.location.replace("/login.html");
  } else {
    const name = user.name;
    const email = user.email;
    const phone = typeof user.phone === "string" ? user.phone : "";
    const message = typeof user.message === "string" ? user.message : "";
    const id = user.id ? String(user.id) : "";
    const registeredAt = user.createdAt ? new Date(user.createdAt) : null;
    const formattedDate =
      registeredAt && !Number.isNaN(registeredAt.getTime())
        ? registeredAt.toLocaleString()
        : "Unavailable";

    document.getElementById("avatar").textContent = name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("profileId").textContent = id;
    document.getElementById("profilePhone").textContent = phone;
    document.getElementById("profileMessage").textContent =
      message || "No message added.";
    document.getElementById("profileCreatedAt").textContent = formattedDate;

    const qrContainer = document.getElementById("qrcode");
    const qrData = [
      "USER PROFILE",
      `Account ID: ${id}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Contact: ${phone}`,
      `Message: ${message || "No message added."}`,
      `Registered: ${formattedDate}`,
    ].join("\n");

    if (typeof QRCode === "undefined") {
      qrContainer.textContent =
        "QR library failed to load. Check your internet connection.";
      console.error("QRCode.js is unavailable.");
    } else {
      try {
        new QRCode(qrContainer, {
          text: qrData,
          width: 240,
          height: 240,
          colorDark: "#202640",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
      } catch (error) {
        qrContainer.textContent = "Unable to generate QR code.";
        console.error("QR generation error:", error);
      }
    }

    document.getElementById("downloadQR").addEventListener("click", () => {
      const canvas = qrContainer.querySelector("canvas");
      const image = qrContainer.querySelector("img");
      const qrStatus = document.getElementById("qrStatus");
      let url;

      try {
        if (canvas) {
          url = canvas.toDataURL("image/png");
        } else if (image && image.src) {
          url = image.src;
        }
      } catch (error) {
        qrStatus.textContent = "Unable to prepare the QR code download.";
        qrStatus.className = "status failure";
        console.error("QR download error:", error);
        return;
      }

      if (!url) {
        qrStatus.textContent = "QR code is not ready yet.";
        qrStatus.className = "status failure";
        return;
      }

      qrStatus.textContent = "";
      qrStatus.className = "status";
      const link = document.createElement("a");
      link.href = url;
      link.download = "registration-profile-qr.png";
      link.click();
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
      sessionStorage.removeItem(profileKey);
      window.location.replace("/login.html");
    });
  }
}
