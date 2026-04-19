import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMatches, deleteMatch } from '../api/match.js'

const STATUS_LABELS = {
  Scheduled: 'Planlandı',
  Live: 'Canlı',
  Finished: 'Bitti',
  Postponed: 'Ertelendi',
}

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return '—'
  }
}

export function AdminMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMatches()
        const list = Array.isArray(data) ? data : []
        list.sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
        setMatches(list)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (matchId) => {
    if (deleteConfirm === matchId) {
      try {
        await deleteMatch(matchId)
        setMatches(prev => prev.filter(m => m.matchId !== matchId))
        setDeleteConfirm(null)
      } catch (e) {
        console.error(e)
      }
    } else {
      setDeleteConfirm(matchId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const stats = useMemo(() => {
    const byStatus = {}
    for (const m of matches) {
      const s = m.status || '—'
      byStatus[s] = (byStatus[s] || 0) + 1
    }
    return { total: matches.length, byStatus }
  }, [matches])

  if (loading) {
    return (
      <div className="admin-teams-loading">
        <div className="ad-spinner" />
        <p>Maçlar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="admin-teams-page admin-matches-page">
      <div className="admin-teams-header">
        <div className="admin-teams-title-section">
          <h1 className="admin-teams-title">Maç yönetimi</h1>
          <p className="admin-teams-subtitle">
            Maçları listeleyin; sezon, takım ve stadyum bilgileri API üzerinden gelir
          </p>
        </div>
        <Link to="/admin/add-match" className="admin-teams-add-btn">
          <span className="admin-teams-add-icon">➕</span>
          Yeni maç
        </Link>
      </div>

      <div className="admin-teams-stats">
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">⚽</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{stats.total}</h3>
            <p className="admin-teams-stat-label">Kayıtlı maç</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">📅</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{stats.byStatus.Finished ?? 0}</h3>
            <p className="admin-teams-stat-label">Tamamlanan</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">⏳</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{stats.byStatus.Scheduled ?? 0}</h3>
            <p className="admin-teams-stat-label">Planlanan</p>
          </div>
        </div>
      </div>

      <div className="admin-matches-list">
        {matches.map(m => (
          <article key={m.matchId} className="admin-matches-card">
            <div className="admin-matches-card-top">
              <div className="admin-matches-card-meta">
                <span className="admin-matches-season">{m.seasonName}</span>
                <span className="admin-matches-dot">·</span>
                <span>{m.weekNumber}. hafta</span>
                <span className="admin-matches-dot">·</span>
                <span>{formatWhen(m.matchDate)}</span>
              </div>
              <span
                className={`admin-matches-status admin-matches-status--${(m.status || '')
                  .toLowerCase()}`}
              >
                {STATUS_LABELS[m.status] ?? m.status}
              </span>
            </div>

            <div className="admin-matches-card-teams">
              <div className="admin-matches-side admin-matches-side--home">
                {m.homeTeamLogo ? (
                  <img src={m.homeTeamLogo} alt="" className="admin-matches-logo" />
                ) : (
                  <span className="admin-matches-logo-fallback">🏠</span>
                )}
                <div>
                  <div className="admin-matches-team-name">{m.homeTeamName}</div>
                  <div className="admin-matches-team-short">{m.homeTeamShortName}</div>
                </div>
              </div>

              <div className="admin-matches-scorebox">
                {m.homeScore != null && m.awayScore != null ? (
                  <span className="admin-matches-score">
                    {m.homeScore} — {m.awayScore}
                  </span>
                ) : (
                  <span className="admin-matches-score admin-matches-score--pending">vs</span>
                )}
                {(m.homeScoreHT != null || m.awayScoreHT != null) && (
                  <span className="admin-matches-ht">
                    İY {m.homeScoreHT ?? '—'} — {m.awayScoreHT ?? '—'}
                  </span>
                )}
              </div>

              <div className="admin-matches-side admin-matches-side--away">
                <div className="admin-matches-side-text">
                  <div className="admin-matches-team-name">{m.awayTeamName}</div>
                  <div className="admin-matches-team-short">{m.awayTeamShortName}</div>
                </div>
                {m.awayTeamLogo ? (
                  <img src={m.awayTeamLogo} alt="" className="admin-matches-logo" />
                ) : (
                  <span className="admin-matches-logo-fallback">✈️</span>
                )}
              </div>
            </div>

            <div className="admin-matches-card-foot">
              <div className="admin-matches-stadium">
                <span className="admin-matches-stadium-icon">🥅</span>
                {m.stadiumName}
                <span className="admin-matches-id">ID: {m.matchId}</span>
              </div>
              <div className="admin-teams-card-actions admin-matches-card-actions">
                <Link
                  to={`/admin/edit-match/${m.matchId}`}
                  className="admin-teams-action-btn admin-teams-edit-btn"
                >
                  <span className="admin-teams-action-icon">✏️</span>
                  Düzenle
                </Link>
                <Link
                  to={`/admin/add-match-event/${m.matchId}`}
                  className="admin-teams-action-btn admin-teams-matchevent-btn"
                >
                  <span className="admin-teams-action-icon">⚽</span>
                  MatchEvent
                </Link>
                <Link
                  to={`/admin/add-match-statistics/${m.matchId}`}
                  className="admin-teams-action-btn admin-teams-matchstats-btn"
                >
                  <span className="admin-teams-action-icon">📊</span>
                  MatchStatistics
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(m.matchId)}
                  className={`admin-teams-action-btn admin-teams-delete-btn ${
                    deleteConfirm === m.matchId ? 'admin-teams-delete-confirm' : ''
                  }`}
                >
                  <span className="admin-teams-action-icon">
                    {deleteConfirm === m.matchId ? '⚠️' : '🗑️'}
                  </span>
                  {deleteConfirm === m.matchId ? 'Emin misiniz?' : 'Sil'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {matches.length === 0 && !loading && (
        <div className="admin-teams-empty">
          <div className="admin-teams-empty-icon">⚽</div>
          <h3>Henüz maç yok</h3>
          <p>İlk maçı eklemek için yukarıdaki butonu kullanın.</p>
          <Link to="/admin/add-match" className="admin-teams-empty-btn">
            Maç ekle
          </Link>
        </div>
      )}
    </div>
  )
}
