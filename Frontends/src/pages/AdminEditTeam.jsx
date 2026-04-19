import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchTeamById, updateTeam } from '../api/teams.js'
import { fetchStadiums } from '../api/stadiums.js'
import { fetchLeagues } from '../api/leagues.js'

function mapTeamToForm(team) {
  return {
    leagueId: team.leagueId != null ? String(team.leagueId) : '',
    homeStadiumId: team.homeStadiumId != null ? String(team.homeStadiumId) : '',
    name: team.name ?? '',
    shortName: team.shortName ?? '',
    city: team.city ?? '',
    logoUrl: team.logoUrl ?? '',
    founded: team.founded != null ? String(team.founded) : '',
    isActive: team.isActive !== false,
  }
}

export function AdminEditTeam() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(mapTeamToForm({}))
  const [originalData, setOriginalData] = useState(mapTeamToForm({}))
  const [stadiums, setStadiums] = useState([])
  const [leagues, setLeagues] = useState([])
  const [listsLoading, setListsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [team, stList, lgList] = await Promise.all([
          fetchTeamById(teamId),
          fetchStadiums(),
          fetchLeagues(),
        ])
        if (cancelled) return
        setStadiums(Array.isArray(stList) ? stList : [])
        setLeagues(Array.isArray(lgList) ? lgList : [])
        const fd = mapTeamToForm(team)
        setFormData(fd)
        setOriginalData(fd)
      } catch (error) {
        console.error('Takım yüklenemedi:', error)
        setErrors({ load: 'Takım bilgileri yüklenemedi veya bulunamadı.' })
      } finally {
        if (!cancelled) {
          setLoading(false)
          setListsLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [teamId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const next = type === 'checkbox' ? checked : value
    setFormData(prev => ({ ...prev, [name]: next }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!String(formData.leagueId).trim()) newErrors.leagueId = 'Lig seçin'
    if (!formData.name.trim()) newErrors.name = 'Takım adı gereklidir'
    if (!formData.shortName.trim()) newErrors.shortName = 'Kısa ad gereklidir'
    if (!formData.city.trim()) newErrors.city = 'Şehir gereklidir'
    if (!formData.logoUrl.trim()) newErrors.logoUrl = 'Logo URL gereklidir'
    if (formData.founded !== '' && formData.founded != null) {
      const y = Number(formData.founded)
      if (Number.isNaN(y) || y < 1800 || y > 2030) newErrors.founded = 'Geçerli bir yıl girin'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildDto = () => ({
    teamId: Number(teamId),
    leagueId: Number(formData.leagueId),
    homeStadiumId: formData.homeStadiumId === '' ? null : Number(formData.homeStadiumId),
    name: formData.name.trim(),
    shortName: formData.shortName.trim(),
    city: formData.city.trim(),
    logoUrl: formData.logoUrl.trim(),
    founded: formData.founded === '' || formData.founded == null ? null : Number(formData.founded),
    isActive: Boolean(formData.isActive),
  })

  const hasChanges = () =>
    Object.keys(formData).some(key => String(formData[key]) !== String(originalData[key]))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!hasChanges()) {
      navigate('/admin/teams', { state: { message: 'Herhangi bir değişiklik yapılmadı.' } })
      return
    }
    setIsSubmitting(true)
    try {
      await updateTeam(buildDto())
      navigate('/admin/teams', { state: { message: 'Takım başarıyla güncellendi!' } })
    } catch (error) {
      console.error('Takım güncellenemedi:', error)
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Takım güncellenirken bir hata oluştu.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(originalData)
    setErrors({})
  }

  const handleLogoPreview = (url) => {
    return url && /^https?:\/\//i.test(url) ? url : '/placeholder-logo.png'
  }

  const stadiumLabel = (s) => `${s.name}${s.city ? ` — ${s.city}` : ''}`

  if (loading) {
    return (
      <div className="admin-edit-team-loading">
        <div className="ad-spinner" />
        <p>Takım bilgileri yükleniyor...</p>
      </div>
    )
  }

  if (errors.load) {
    return (
      <div className="admin-edit-team-error">
        <h3>Hata</h3>
        <p>{errors.load}</p>
        <Link to="/admin/teams" className="admin-edit-team-back-btn">Takımlar listesine dön</Link>
      </div>
    )
  }

  return (
    <div className="admin-edit-team-page">
      <div className="admin-edit-team-header">
        <div className="admin-edit-team-nav">
          <Link to="/admin/teams" className="admin-edit-team-back">
            <span className="admin-edit-team-back-icon">←</span>
            Takımlar
          </Link>
        </div>
        <div className="admin-edit-team-title-section">
          <h1 className="admin-edit-team-title">Takım düzenle</h1>
          <p className="admin-edit-team-subtitle">
            {originalData.name ? `${originalData.name} bilgilerini güncelleyin` : 'Takım bilgilerini güncelleyin'}
          </p>
        </div>
      </div>

      <div className="admin-edit-team-content">
        <div className="admin-edit-team-form-container">
          <form onSubmit={handleSubmit} className="admin-edit-team-form">
            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Lig &amp; stadyum</h3>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Lig <span className="admin-edit-team-required">*</span>
                  </label>
                  <select
                    name="leagueId"
                    value={formData.leagueId}
                    onChange={handleInputChange}
                    disabled={listsLoading}
                    className={`admin-edit-team-input admin-edit-team-select ${errors.leagueId ? 'admin-edit-team-input-error' : ''}`}
                  >
                    <option value="">Lig seçin…</option>
                    {leagues.map(lg => (
                      <option key={lg.leagueId} value={lg.leagueId}>
                        {lg.name}{lg.country ? ` (${lg.country})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.leagueId && <span className="admin-edit-team-error">{errors.leagueId}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Ev sahası (stadyum)</label>
                  <select
                    name="homeStadiumId"
                    value={formData.homeStadiumId}
                    onChange={handleInputChange}
                    disabled={listsLoading}
                    className="admin-edit-team-input admin-edit-team-select"
                  >
                    <option value="">Seçiniz (opsiyonel)</option>
                    {stadiums.map(s => (
                      <option key={s.stadiumId} value={s.stadiumId}>
                        {stadiumLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Temel bilgiler</h3>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Takım adı <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`admin-edit-team-input ${errors.name ? 'admin-edit-team-input-error' : ''}`}
                    placeholder="Örn: Manchester United"
                  />
                  {errors.name && <span className="admin-edit-team-error">{errors.name}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Kısa ad <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                    className={`admin-edit-team-input ${errors.shortName ? 'admin-edit-team-input-error' : ''}`}
                    placeholder="Örn: Man Utd"
                    maxLength={64}
                  />
                  {errors.shortName && <span className="admin-edit-team-error">{errors.shortName}</span>}
                </div>
              </div>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Şehir <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`admin-edit-team-input ${errors.city ? 'admin-edit-team-input-error' : ''}`}
                    placeholder="Örn: Manchester"
                  />
                  {errors.city && <span className="admin-edit-team-error">{errors.city}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Kuruluş</label>
                  <input
                    type="number"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className={`admin-edit-team-input ${errors.founded ? 'admin-edit-team-input-error' : ''}`}
                    placeholder="Örn: 1878"
                    min="1800"
                    max="2030"
                  />
                  {errors.founded && <span className="admin-edit-team-error">{errors.founded}</span>}
                </div>
              </div>
            </div>

            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Görsel</h3>
              <div className="admin-edit-team-field">
                <label className="admin-edit-team-label">
                  Logo URL <span className="admin-edit-team-required">*</span>
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  className={`admin-edit-team-input ${errors.logoUrl ? 'admin-edit-team-input-error' : ''}`}
                  placeholder="https://..."
                />
                {errors.logoUrl && <span className="admin-edit-team-error">{errors.logoUrl}</span>}
              </div>
              <div className="admin-edit-team-field admin-edit-team-checkbox-row">
                <label className="admin-edit-team-label admin-edit-team-checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Aktif
                </label>
              </div>
            </div>

            {errors.submit && (
              <div className="admin-edit-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-edit-team-actions">
              <Link to="/admin/teams" className="admin-edit-team-cancel">İptal</Link>
              {hasChanges() && (
                <button type="button" onClick={handleReset} className="admin-edit-team-reset">
                  Sıfırla
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || listsLoading || !hasChanges()}
                className="admin-edit-team-submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="admin-edit-team-spinner" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <span className="admin-edit-team-submit-icon">✓</span>
                    Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-edit-team-preview">
          <h3 className="admin-edit-team-preview-title">Önizleme</h3>
          <div className="admin-edit-team-preview-card">
            <div className="admin-edit-team-preview-logo">
              <img
                src={handleLogoPreview(formData.logoUrl)}
                alt=""
                onError={(e) => { e.target.src = '/placeholder-logo.png' }}
              />
            </div>
            <div className="admin-edit-team-preview-info">
              <h4 className="admin-edit-team-preview-name">{formData.name || 'Takım adı'}</h4>
              <p className="admin-edit-team-preview-city">{formData.city || 'Şehir'}</p>
              <span className="admin-edit-team-preview-code">{formData.shortName || 'Kısa ad'}</span>
            </div>
          </div>
          {hasChanges() && (
            <div className="admin-edit-team-changes-indicator">
              <span className="admin-edit-team-changes-icon">⚠️</span>
              Kaydedilmemiş değişiklikler var
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
