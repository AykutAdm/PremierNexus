import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLeagues, deleteLeague } from '../api/leagues.js'

export function AdminLeagues() {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLeagues()
        setLeagues(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (leagueId) => {
    if (deleteConfirm === leagueId) {
      try {
        await deleteLeague(leagueId)
        setLeagues(prev => prev.filter(l => l.leagueId !== leagueId))
        setDeleteConfirm(null)
      } catch (e) {
        console.error(e)
      }
    } else {
      setDeleteConfirm(leagueId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const withCountry = leagues.filter(l => l.country).length
  const countries = new Set(leagues.map(l => l.country).filter(Boolean)).size

  if (loading) {
    return (
      <div className="admin-teams-loading">
        <div className="ad-spinner" />
        <p>Ligler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="admin-teams-page">
      <div className="admin-teams-header">
        <div className="admin-teams-title-section">
          <h1 className="admin-teams-title">Lig yönetimi</h1>
          <p className="admin-teams-subtitle">Ligleri listeleyin, ekleyin ve düzenleyin</p>
        </div>
        <Link to="/admin/add-league" className="admin-teams-add-btn">
          <span className="admin-teams-add-icon">➕</span>
          Yeni lig
        </Link>
      </div>

      <div className="admin-teams-stats">
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">🏆</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{leagues.length}</h3>
            <p className="admin-teams-stat-label">Toplam lig</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">🌍</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{countries}</h3>
            <p className="admin-teams-stat-label">Farklı ülke</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">📍</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{withCountry}</h3>
            <p className="admin-teams-stat-label">Ülke bilgisi olan</p>
          </div>
        </div>
      </div>

      <div className="admin-teams-grid">
        {leagues.map(l => (
          <div key={l.leagueId} className="admin-teams-card">
            <div className="admin-teams-card-header">
              <div className="admin-teams-card-logo admin-league-card-icon" aria-hidden>
                🏆
              </div>
              <div className="admin-teams-card-info">
                <h3 className="admin-teams-card-name">{l.name}</h3>
                <p className="admin-teams-card-city">{l.country || 'Ülke belirtilmedi'}</p>
                <span className="admin-teams-card-code">ID: {l.leagueId}</span>
              </div>
            </div>
            <div className="admin-teams-card-details">
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Ülke</span>
                <span className="admin-teams-detail-value">{l.country ?? '—'}</span>
              </div>
            </div>
            <div className="admin-teams-card-actions">
              <Link
                to={`/admin/edit-league/${l.leagueId}`}
                className="admin-teams-action-btn admin-teams-edit-btn"
              >
                <span className="admin-teams-action-icon">✏️</span>
                Düzenle
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(l.leagueId)}
                className={`admin-teams-action-btn admin-teams-delete-btn ${
                  deleteConfirm === l.leagueId ? 'admin-teams-delete-confirm' : ''
                }`}
              >
                <span className="admin-teams-action-icon">
                  {deleteConfirm === l.leagueId ? '⚠️' : '🗑️'}
                </span>
                {deleteConfirm === l.leagueId ? 'Emin misiniz?' : 'Sil'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {leagues.length === 0 && !loading && (
        <div className="admin-teams-empty">
          <div className="admin-teams-empty-icon">🏆</div>
          <h3>Henüz lig yok</h3>
          <p>İlk ligi eklemek için yukarıdaki butonu kullanın.</p>
          <Link to="/admin/add-league" className="admin-teams-empty-btn">
            Lig ekle
          </Link>
        </div>
      )}
    </div>
  )
}
