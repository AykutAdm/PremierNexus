import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchStadiums, deleteStadium } from '../api/stadiums.js'

export function AdminStadiums() {
  const [stadiums, setStadiums] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStadiums()
        setStadiums(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (stadiumId) => {
    if (deleteConfirm === stadiumId) {
      try {
        await deleteStadium(stadiumId)
        setStadiums(prev => prev.filter(s => s.stadiumId !== stadiumId))
        setDeleteConfirm(null)
      } catch (e) {
        console.error(e)
      }
    } else {
      setDeleteConfirm(stadiumId)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const totalCap = stadiums.reduce((sum, s) => sum + (s.capacity ?? 0), 0)
  const cities = new Set(stadiums.map(s => s.city).filter(Boolean)).size

  if (loading) {
    return (
      <div className="admin-teams-loading">
        <div className="ad-spinner" />
        <p>Stadyumlar yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="admin-teams-page">
      <div className="admin-teams-header">
        <div className="admin-teams-title-section">
          <h1 className="admin-teams-title">Stadyum yönetimi</h1>
          <p className="admin-teams-subtitle">Stadyumları listeleyin, ekleyin ve düzenleyin</p>
        </div>
        <Link to="/admin/add-stadium" className="admin-teams-add-btn">
          <span className="admin-teams-add-icon">➕</span>
          Yeni stadyum
        </Link>
      </div>

      <div className="admin-teams-stats">
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">🏟️</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{stadiums.length}</h3>
            <p className="admin-teams-stat-label">Toplam stadyum</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">👥</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{totalCap.toLocaleString('tr-TR')}</h3>
            <p className="admin-teams-stat-label">Toplam kapasite</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">📍</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{cities}</h3>
            <p className="admin-teams-stat-label">Farklı şehir</p>
          </div>
        </div>
      </div>

      <div className="admin-teams-grid">
        {stadiums.map(s => (
          <div key={s.stadiumId} className="admin-teams-card">
            <div className="admin-teams-card-header">
              <div className="admin-teams-card-logo admin-stadium-card-icon" aria-hidden>
                🏟️
              </div>
              <div className="admin-teams-card-info">
                <h3 className="admin-teams-card-name">{s.name}</h3>
                <p className="admin-teams-card-city">{s.city}</p>
                <span className="admin-teams-card-code">ID: {s.stadiumId}</span>
              </div>
            </div>
            <div className="admin-teams-card-details">
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Kapasite</span>
                <span className="admin-teams-detail-value">
                  {s.capacity != null ? s.capacity.toLocaleString('tr-TR') : '—'}
                </span>
              </div>
            </div>
            <div className="admin-teams-card-actions">
              <Link
                to={`/admin/edit-stadium/${s.stadiumId}`}
                className="admin-teams-action-btn admin-teams-edit-btn"
              >
                <span className="admin-teams-action-icon">✏️</span>
                Düzenle
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(s.stadiumId)}
                className={`admin-teams-action-btn admin-teams-delete-btn ${
                  deleteConfirm === s.stadiumId ? 'admin-teams-delete-confirm' : ''
                }`}
              >
                <span className="admin-teams-action-icon">
                  {deleteConfirm === s.stadiumId ? '⚠️' : '🗑️'}
                </span>
                {deleteConfirm === s.stadiumId ? 'Emin misiniz?' : 'Sil'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {stadiums.length === 0 && !loading && (
        <div className="admin-teams-empty">
          <div className="admin-teams-empty-icon">🏟️</div>
          <h3>Henüz stadyum yok</h3>
          <p>İlk stadyumu eklemek için yukarıdaki butonu kullanın.</p>
          <Link to="/admin/add-stadium" className="admin-teams-empty-btn">
            Stadyum ekle
          </Link>
        </div>
      )}
    </div>
  )
}
