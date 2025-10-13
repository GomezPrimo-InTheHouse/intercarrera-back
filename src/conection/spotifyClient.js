// src/connection/spotifyClient.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const authHeader = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
  },
};

export async function exchangeCodeForToken(code) {
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    });

    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      body,
      authHeader
    );

    return data; // { access_token, refresh_token, expires_in }
  } catch (error) {
    throw new Error(
      error.response?.data?.error_description || 'Error al obtener tokens'
    );
  }
}

export async function refreshAccessToken(refresh_token) {
  try {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    });

    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      body,
      authHeader
    );

    return data; // nuevo access_token
  } catch (error) {
    throw new Error(
      error.response?.data?.error_description || 'Error al refrescar token'
    );
  }
}

export async function getUserProfile(access_token) {
  try {
    const { data } = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return data; // perfil del usuario
  } catch (error) {
    throw new Error('Error al obtener perfil de usuario: ' + error.message);
  }
}
