import { API_BASE_URL } from './client.js';

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * GET /api/MatchEvents/match/{matchId} - Belirli maça ait eventler
 */
export async function fetchEventsByMatch(matchId) {
  const res = await fetch(`${API_BASE_URL}/api/MatchEvents/match/${matchId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Match Events isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/MatchEvents - Tüm eventler
 */
export async function fetchAllEvents() {
  const res = await fetch(`${API_BASE_URL}/api/MatchEvents`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `All Events isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/** POST /api/MatchEvents — CreateMatchEventDto */
export async function createMatchEvent(dto) {
  const res = await fetch(`${API_BASE_URL}/api/MatchEvents`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Maç olayı eklenemedi: ${res.status} — ${text}`);
  }
  return res.text();
}