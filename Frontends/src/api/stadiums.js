import { API_BASE_URL } from './client.js'

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * GET /api/Stadiums — ResultStadiumDto: stadiumId, name, city, capacity
 */
export async function fetchStadiums() {
  const res = await fetch(`${API_BASE_URL}/api/Stadiums`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stadyumlar isteği başarısız: ${res.status} — ${text}`)
  }
  return res.json()
}

/**
 * GET /api/Stadiums/{id}
 */
export async function fetchStadiumById(id) {
  const res = await fetch(`${API_BASE_URL}/api/Stadiums/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stadyum detay isteği başarısız: ${res.status} — ${text}`)
  }
  return res.json()
}

/** POST /api/Stadiums — CreateStadiumDto */
export async function createStadium(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Stadiums`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stadyum eklenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** PUT /api/Stadiums — UpdateStadiumDto */
export async function updateStadium(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Stadiums`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stadyum güncellenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/** DELETE /api/Stadiums/{id} */
export async function deleteStadium(id) {
  const res = await fetch(`${API_BASE_URL}/api/Stadiums/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Stadyum silinemedi: ${res.status} — ${text}`)
  }
  return res.text()
}
