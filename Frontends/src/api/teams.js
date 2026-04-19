import { API_BASE_URL } from './client.js';

/**
 * GET https://localhost:7079/api/Teams
 * Backend JSON property isimleri genelde camelCase (teamId, name, ...)
 */
export async function fetchTeams() {
  const res = await fetch(`${API_BASE_URL}/api/Teams`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Teams isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Teams/{id} - Navigation properties ile beraber
 */
export async function fetchTeamById(id) {
  const res = await fetch(`${API_BASE_URL}/api/Teams/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Team detay isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

/**
 * GET /api/Teams/league/{leagueId} - Belirli lig takımları
 */
export async function fetchTeamsByLeague(leagueId) {
  const res = await fetch(`${API_BASE_URL}/api/Teams/league/${leagueId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `League Teams isteği başarısız: ${res.status} ${res.statusText} — ${text}`,
    );
  }

  return res.json();
}

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * POST /api/Teams — CreateTeamDto
 */
export async function createTeam(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Teams`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Takım eklenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/**
 * PUT /api/Teams — UpdateTeamDto
 */
export async function updateTeam(dto) {
  const res = await fetch(`${API_BASE_URL}/api/Teams`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Takım güncellenemedi: ${res.status} — ${text}`)
  }
  return res.text()
}

/**
 * DELETE /api/Teams/{id}
 */
export async function deleteTeam(teamId) {
  const res = await fetch(`${API_BASE_URL}/api/Teams/${teamId}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Takım silinemedi: ${res.status} — ${text}`)
  }
  return res.text()
}
