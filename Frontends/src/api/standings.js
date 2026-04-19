import { API_BASE_URL } from './client.js';

/**
 * YENİ: Aktif sezon için puan durumu (Stored Procedure)
 * GET /api/standings/current/{leagueId}
 */
export async function fetchCurrentStandings(leagueId) {
  const res = await fetch(`${API_BASE_URL}/api/standings/current/${leagueId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Current Standings isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * YENİ: Belirli sezon için puan durumu
 * GET /api/standings/season/{seasonId}
 */
export async function fetchStandingsBySeason(seasonId) {
  const res = await fetch(`${API_BASE_URL}/api/standings/season/${seasonId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Season Standings isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}
