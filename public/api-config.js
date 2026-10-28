window.DOM_REGISTRATION_API_URL = "";

(() => {
  const configuredUrl = window.DOM_REGISTRATION_API_URL.trim().replace(/\/+$/, "");
  const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(
    window.location.hostname,
  );
  const apiBaseUrl =
    configuredUrl || (isLocalDevelopment ? window.location.origin : "");

  window.getDomRegistrationApiUrl = (endpoint) => {
    if (!apiBaseUrl) {
      throw new Error(
        "The API server is not configured. Deploy the backend and set its URL in api-config.js.",
      );
    }

    return `${apiBaseUrl}/api/${endpoint}`;
  };
})();
