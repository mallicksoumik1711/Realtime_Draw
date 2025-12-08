export function getLoggedInUserId() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || null;
  } catch (err) {
    console.error("Token decode failed:", err);
    return null;
  }
}
