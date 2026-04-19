import { API_BASE_URL } from './client.js';

/**
 * GET /api/Seasons
 */
export async function fetchSeasons() {
  const res = await fetch(`${API_BASE_URL}/api/Seasons`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Seasons isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Seasons/league/{leagueId} - Belirli bir lig için sezonlar
 */
export async function fetchSeasonsByLeague(leagueId) {
  const res = await fetch(`${API_BASE_URL}/api/Seasons/league/${leagueId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `League Seasons isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}