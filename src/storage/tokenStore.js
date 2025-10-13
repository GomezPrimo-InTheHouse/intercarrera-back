let accessToken = null;
let refreshToken = null;
let expiresAt = 0; // timestamp ms

export function setTokens({ access_token, refresh_token, expires_in }) {
  accessToken = access_token || accessToken;
  refreshToken = refresh_token || refreshToken;
  // ahora + expires_in segundos
  if (expires_in) {
    expiresAt = Date.now() + (expires_in * 1000 - 10_000); // 10s de margen
  }
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function isAccessTokenExpired() {
  return Date.now() >= expiresAt;
}
