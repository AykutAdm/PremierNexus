import { API_BASE_URL } from './client.js'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * GET /api/Leagues — ResultLeagueDto: leagueId, name, country
 */
export async function fetchLeagues() {
  const res = await fetch(`${API_BASE_URL}/api/Leagues`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ligler isteği başarısız: ${res.status} — ${text}`)
  }
  return res.json()
}

/**
 * GET /api/Leagues/{id}
 */
export async function fetchLeagueById(id) {
  const res = await fetch(`${API_BASE_URL}/api/Leagues/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Lig detay isteği başarısız: ${res.status} — ${text}`)
  }
  return res.json()
}

/** POST /api/Leagues — CreateLeagueDto */
export async function createLeague(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Leagues`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Lig eklenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** PUT /api/Leagues — UpdateLeagueDto */
export async function updateLeague(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Leagues`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Lig güncellenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** DELETE /api/Leagues/{id} */
export async function deleteLeague(id) {
  const res = await fetch(`${API_BASE_URL}/api/Leagues/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Lig silinemedi: ${res.status} — ${text}`)
  }
  return res.text()
}
