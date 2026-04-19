import { API_BASE_URL } from './client.js';

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

/**
 * GET /api/MatchStatistics/match/{matchId} - Belirli maça ait istatistikler
 */
export async function fetchStatisticsByMatch(matchId) {
  const res = await fetch(`${API_BASE_URL}/api/MatchStatistics/match/${matchId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    // 404 ise (istatistik yok) null dön
    if (res.status === 404) {
      return null;
    }
    const text = await res.text();
    throw new Error(
      `Match Statistics isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/MatchStatistics - Tüm istatistikler
 */
export async function fetchAllStatistics() {
  const res = await fetch(`${API_BASE_URL}/api/MatchStatistics`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `All Statistics isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/** POST /api/MatchStatistics — CreateMatchStatisticsDto */
export async function createMatchStatistics(dto) {
  const res = await fetch(`${API_BASE_URL}/api/MatchStatistics`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Maç istatistiği eklenemedi: ${res.status} — ${text}`);
  }
  return res.text();
}