import { API_BASE_URL } from './client.js';

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * YENİ: GET /api/Matches/with-full-navigation - Tam navigation properties ile
 * Takım logoları, stadyum isimleri, sezon bilgileri dahil
 */
export async function fetchMatches() {
  const res = await fetch(`${API_BASE_URL}/api/Matches/with-full-navigation`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Matches isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * ESKİ: GET /api/Matches - Basit navigation
 */
export async function fetchMatchesBasic() {
  const res = await fetch(`${API_BASE_URL}/api/Matches`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Basic Matches isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Matches/{id} - Tek maç detayı
 */
export async function fetchMatchById(id) {
  const res = await fetch(`${API_BASE_URL}/api/Matches/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Match detay isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Matches/season/{seasonId} - Sezona göre maçlar
 */
export async function fetchMatchesBySeason(seasonId) {
  const res = await fetch(`${API_BASE_URL}/api/Matches/season/${seasonId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Season Matches isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Matches/week/{weekNumber} - Haftaya göre maçlar
 */
export async function fetchMatchesByWeek(weekNumber) {
  const res = await fetch(`${API_BASE_URL}/api/Matches/week/${weekNumber}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Week Matches isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/** POST /api/Matches — CreateMatchDto */
export async function createMatch(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Matches`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Maç eklenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** PUT /api/Matches — UpdateMatchDto */
export async function updateMatch(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Matches`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Maç güncellenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** DELETE /api/Matches/{id} */
export async function deleteMatch(matchId) {
  const res = await fetch(`${API_BASE_URL}/api/Matches/${matchId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Maç silinemedi: ${res.status} — ${text}`)
  }
  return res.text()
}
