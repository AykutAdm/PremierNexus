import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTeams, deleteTeam } from '../api/teams.js'

export function AdminTeams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams()
        setTeams(data)
      } catch (error) {
        console.error('Takımlar yüklenemedi:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTeams()
  }, [])

  const handleDelete = async (teamId) => {
    if (deleteConfirm === teamId) {
      try {
        await deleteTeam(teamId)
        setTeams(prev => prev.filter(t => t.teamId !== teamId))
        setDeleteConfirm(null)
      } catch (error) {
        console.error('Takım silinemedi:', error)
      }
    } else {
      setDeleteConfirm(teamId)
      // 3 saniye sonra confirm'u iptal et
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  if (loading) return (
    <div className="admin-teams-loading">
      <div className="ad-spinner" />
      <p>Takımlar yükleniyor...</p>
    </div>
  )

  return (
    <div className="admin-teams-page">
      {/* Header */}
      <div className="admin-teams-header">
        <div className="admin-teams-title-section">
          <h1 className="admin-teams-title">Takım Yönetimi</h1>
          <p className="admin-teams-subtitle">
            Takımları görüntüleyin, düzenleyin ve yönetin
          </p>
        </div>
        <Link to="/admin/add-team" className="admin-teams-add-btn">
          <span className="admin-teams-add-icon">➕</span>
          Yeni Takım Ekle
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="admin-teams-stats">
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">🏟️</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">{teams.length}</h3>
            <p className="admin-teams-stat-label">Toplam Takım</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">🏆</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">
              {new Set(teams.map(t => t.leagueName).filter(Boolean)).size}
            </h3>
            <p className="admin-teams-stat-label">Lig</p>
          </div>
        </div>
        <div className="admin-teams-stat-card">
          <div className="admin-teams-stat-icon">📊</div>
          <div className="admin-teams-stat-content">
            <h3 className="admin-teams-stat-number">
              {new Set(teams.map(t => t.city).filter(Boolean)).size}
            </h3>
            <p className="admin-teams-stat-label">Farklı Şehir</p>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="admin-teams-grid">
        {teams.map(team => (
          <div key={team.teamId} className="admin-teams-card">
            {/* Team Info */}
            <div className="admin-teams-card-header">
              <div className="admin-teams-card-logo">
                <img src={team.logoUrl} alt={team.name} />
              </div>
              <div className="admin-teams-card-info">
                <h3 className="admin-teams-card-name">{team.name}</h3>
                <p className="admin-teams-card-city">{team.city}</p>
                <span className="admin-teams-card-code">{team.shortName}</span>
              </div>
            </div>

            {/* Team Details */}
            <div className="admin-teams-card-details">
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Lig:</span>
                <span className="admin-teams-detail-value">{team.leagueName ?? '—'}</span>
              </div>
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Stadyum:</span>
                <span className="admin-teams-detail-value">{team.homeStadiumName ?? '—'}</span>
              </div>
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Kuruluş:</span>
                <span className="admin-teams-detail-value">{team.founded ?? '—'}</span>
              </div>
              <div className="admin-teams-detail">
                <span className="admin-teams-detail-label">Durum:</span>
                <span className="admin-teams-detail-value">{team.isActive ? 'Aktif' : 'Pasif'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="admin-teams-card-actions">
              <Link 
                to={`/admin/edit-team/${team.teamId}`}
                className="admin-teams-action-btn admin-teams-edit-btn"
              >
                <span className="admin-teams-action-icon">✏️</span>
                Düzenle
              </Link>
              <button
                onClick={() => handleDelete(team.teamId)}
                className={`admin-teams-action-btn admin-teams-delete-btn ${
                  deleteConfirm === team.teamId ? 'admin-teams-delete-confirm' : ''
                }`}
              >
                <span className="admin-teams-action-icon">
                  {deleteConfirm === team.teamId ? '⚠️' : '🗑️'}
                </span>
                {deleteConfirm === team.teamId ? 'Emin misiniz?' : 'Sil'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div className="admin-teams-empty">
          <div className="admin-teams-empty-icon">🏟️</div>
          <h3>Henüz takım yok</h3>
          <p>İlk takımınızı eklemek için yukarıdaki butona tıklayın.</p>
          <Link to="/admin/add-team" className="admin-teams-empty-btn">
            Takım Ekle
          </Link>
        </div>
      )}
    </div>
  )
}