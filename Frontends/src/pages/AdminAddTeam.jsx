import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTeam } from '../api/teams.js'
import { fetchStadiums } from '../api/stadiums.js'
import { fetchLeagues } from '../api/leagues.js'

const emptyForm = () => ({
  leagueId: '',
  homeStadiumId: '',
  name: '',
  shortName: '',
  city: '',
  logoUrl: '',
  founded: '',
  isActive: true,
})

export function AdminAddTeam() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(emptyForm)
  const [stadiums, setStadiums] = useState([])
  const [leagues, setLeagues] = useState([])
  const [listsLoading, setListsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [stList, lgList] = await Promise.all([fetchStadiums(), fetchLeagues()])
        if (cancelled) return
        setStadiums(Array.isArray(stList) ? stList : [])
        setLeagues(Array.isArray(lgList) ? lgList : [])
        setFormData(prev => ({
          ...prev,
          leagueId: lgList?.length === 1 ? String(lgList[0].leagueId) : prev.leagueId,
        }))
      } catch (e) {
        console.error(e)
        setErrors(prev => ({ ...prev, lists: 'Lig veya stadyum listesi yüklenemedi.' }))
      } finally {
        if (!cancelled) setListsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

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
    leagueId: Number(formData.leagueId),
    homeStadiumId: formData.homeStadiumId === '' ? null : Number(formData.homeStadiumId),
    name: formData.name.trim(),
    shortName: formData.shortName.trim(),
    city: formData.city.trim(),
    logoUrl: formData.logoUrl.trim(),
    founded: formData.founded === '' || formData.founded == null ? null : Number(formData.founded),
    isActive: Boolean(formData.isActive),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await createTeam(buildDto())
      navigate('/admin/teams', { state: { message: 'Takım başarıyla eklendi!' } })
    } catch (error) {
      console.error('Takım eklenemedi:', error)
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Takım eklenirken bir hata oluştu.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogoPreview = (url) => {
    return url && /^https?:\/\//i.test(url) ? url : '/placeholder-logo.png'
  }

  const stadiumLabel = (s) => `${s.name}${s.city ? ` — ${s.city}` : ''}`

  return (
    <div className="admin-add-team-page">
      <div className="admin-add-team-header">
        <div className="admin-add-team-nav">
          <Link to="/admin/teams" className="admin-add-team-back">
            <span className="admin-add-team-back-icon">←</span>
            Takımlar
          </Link>
        </div>
        <div className="admin-add-team-title-section">
          <h1 className="admin-add-team-title">Yeni Takım Ekle</h1>
          <p className="admin-add-team-subtitle">Yeni bir takımı sisteme ekleyin</p>
        </div>
      </div>

      {errors.lists && (
        <div className="admin-add-team-submit-error">{errors.lists}</div>
      )}

      <div className="admin-add-team-content">
        <div className="admin-add-team-form-container">
          <form onSubmit={handleSubmit} className="admin-add-team-form">
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Lig &amp; stadyum</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Lig <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="leagueId"
                    value={formData.leagueId}
                    onChange={handleInputChange}
                    disabled={listsLoading}
                    className={`admin-add-team-input admin-add-team-select ${errors.leagueId ? 'admin-add-team-input-error' : ''}`}
                  >
                    <option value="">Lig seçin…</option>
                    {leagues.map(lg => (
                      <option key={lg.leagueId} value={lg.leagueId}>
                        {lg.name}{lg.country ? ` (${lg.country})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.leagueId && <span className="admin-add-team-error">{errors.leagueId}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Ev sahası (stadyum)</label>
                  <select
                    name="homeStadiumId"
                    value={formData.homeStadiumId}
                    onChange={handleInputChange}
                    disabled={listsLoading}
                    className="admin-add-team-input admin-add-team-select"
                  >
                    <option value="">Seçiniz (opsiyonel)</option>
                    {stadiums.map(s => (
                      <option key={s.stadiumId} value={s.stadiumId}>
                        {stadiumLabel(s)}
                      </option>
                    ))}
                  </select>
                  <span className="admin-add-team-hint">Listede isim görünür; kayıtta HomeStadiumId gönderilir.</span>
                </div>
              </div>
            </div>

            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Temel bilgiler</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Takım adı (Name) <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`admin-add-team-input ${errors.name ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: Manchester United"
                  />
                  {errors.name && <span className="admin-add-team-error">{errors.name}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Kısa ad (ShortName) <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                    className={`admin-add-team-input ${errors.shortName ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: Man Utd"
                    maxLength={64}
                  />
                  {errors.shortName && <span className="admin-add-team-error">{errors.shortName}</span>}
                </div>
              </div>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Şehir <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`admin-add-team-input ${errors.city ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: Manchester"
                  />
                  {errors.city && <span className="admin-add-team-error">{errors.city}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Kuruluş (Founded)</label>
                  <input
                    type="number"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    className={`admin-add-team-input ${errors.founded ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: 1878"
                    min="1800"
                    max="2030"
                  />
                  {errors.founded && <span className="admin-add-team-error">{errors.founded}</span>}
                </div>
              </div>
            </div>

            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Görsel</h3>
              <div className="admin-add-team-field">
                <label className="admin-add-team-label">
                  Logo URL <span className="admin-add-team-required">*</span>
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  className={`admin-add-team-input ${errors.logoUrl ? 'admin-add-team-input-error' : ''}`}
                  placeholder="https://..."
                />
                {errors.logoUrl && <span className="admin-add-team-error">{errors.logoUrl}</span>}
              </div>
              <div className="admin-add-team-field admin-add-team-checkbox-row">
                <label className="admin-add-team-label admin-add-team-checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Aktif (IsActive)
                </label>
              </div>
            </div>

            {errors.submit && (
              <div className="admin-add-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-add-team-actions">
              <Link to="/admin/teams" className="admin-add-team-cancel">İptal</Link>
              <button type="submit" disabled={isSubmitting || listsLoading} className="admin-add-team-submit">
                {isSubmitting ? (
                  <>
                    <span className="admin-add-team-spinner" />
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <span className="admin-add-team-submit-icon">✓</span>
                    Takım Ekle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-add-team-preview">
          <h3 className="admin-add-team-preview-title">Önizleme</h3>
          <div className="admin-add-team-preview-card">
            <div className="admin-add-team-preview-logo">
              <img
                src={handleLogoPreview(formData.logoUrl)}
                alt=""
                onError={(e) => { e.target.src = '/placeholder-logo.png' }}
              />
            </div>
            <div className="admin-add-team-preview-info">
              <h4 className="admin-add-team-preview-name">{formData.name || 'Takım adı'}</h4>
              <p className="admin-add-team-preview-city">{formData.city || 'Şehir'}</p>
              <span className="admin-add-team-preview-code">{formData.shortName || 'Kısa ad'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
