import express from 'express';
import axios from 'axios';
import {
  exchangeCodeForToken,
  refreshAccessToken,
  searchTrack,
  playUris
} from '../connection/spotifyClient.js';
import {
  setTokens, getAccessToken, getRefreshToken, isAccessTokenExpired
} from '../storage/tokenStore.js';
import { interpretarTextoSimple /*, interpretarTextoConGPT */ } from '../services/nlu.service.js';

const router = express.Router();

// 1) Login: redirige a Spotify
router.get('/login', (req, res) => {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming'
  ].join(' ');
  const redirect = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);

  const url = `https://accounts.spotify.com/authorize?response_type=code` +
    `&client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${redirect}`;

  res.redirect(url);
});

// 2) Callback: intercambia code por tokens y los guarda en memoria
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No llegó code');

  try {
    const tokens = await exchangeCodeForToken(code);
    setTokens(tokens); // guarda access/refresh/expires
    res.send('✅ Autenticado con Spotify. Ya podés usar /spotify/comando');
  } catch (e) {
    console.error('callback error:', e.message);
    res.status(500).send('Error autenticando con Spotify');
  }
});

// Helper para asegurar token válido (refresh si venció)
async function ensureAccessToken() {
  if (!getAccessToken()) throw new Error('No hay access_token. Hacé /spotify/login primero.');
  if (isAccessTokenExpired()) {
    const rt = getRefreshToken();
    if (!rt) throw new Error('Access token vencido y no hay refresh_token.');
    const newTokens = await refreshAccessToken(rt);
    setTokens(newTokens);
  }
  return getAccessToken();
}

// 3) Endpoint de comando: interpreta texto y ejecuta acción
router.post('/comando', async (req, res) => {
  const { orden } = req.body;
  if (!orden) return res.status(400).json({ error: 'Falta "orden" en el body' });

  try {
    // A) Baseline sin IA:
    const intent = interpretarTextoSimple(orden);

    // (Si querés con GPT, reemplazá por:)
    // const intent = await interpretarTextoConGPT(orden);

    if (intent.action !== 'play' || !intent.query) {
      return res.status(400).json({ error: 'Por ahora sólo soportamos reproducir canciones' });
    }

    const accessToken = await ensureAccessToken();

    // construir la búsqueda con artista si está
    const q = [intent.query, intent.artist].filter(Boolean).join(' ');
    const data = await searchTrack(accessToken, q, 1);
    const track = data?.tracks?.items?.[0];
    if (!track) return res.status(404).json({ error: 'Canción no encontrada' });

    await playUris(accessToken, [track.uri]);

    res.json({
      success: true,
      mensaje: `Reproduciendo: ${track.name} - ${track.artists.map(a => a.name).join(', ')}`,
      track
    });
  } catch (e) {
    console.error('comando error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
