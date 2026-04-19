import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchStadiumById, updateStadium } from '../api/stadiums.js'

function toForm(s) {
  return {
    name: s?.name ?? '',
    city: s?.city ?? '',
    capacity: s?.capacity != null ? String(s.capacity) : '',
  }
}

export function AdminEditStadium() {
  const { stadiumId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(toForm({}))
  const [original, setOriginal] = useState(toForm({}))
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const s = await fetchStadiumById(stadiumId)
        if (cancelled) return
        const fd = toForm(s)
        setFormData(fd)
        setOriginal(fd)
      } catch (e) {
        console.error(e)
        setErrors({ load: 'Stadyum bulunamadı veya yüklenemedi.' })
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [stadiumId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const ne = {}
    if (!formData.name.trim()) ne.name = 'Stadyum adı gerekli'
    if (!formData.city.trim()) ne.city = 'Şehir gerekli'
    if (formData.capacity !== '') {
      const c = Number(formData.capacity)
      if (Number.isNaN(c) || c < 0) ne.capacity = 'Geçerli bir kapasite girin'
    }
    setErrors(ne)
    return Object.keys(ne).length === 0
  }

  const hasChanges = () =>
    Object.keys(formData).some(k => String(formData[k]) !== String(original[k]))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    if (!hasChanges()) {
      navigate('/admin/stadiums', { state: { message: 'Değişiklik yok.' } })
      return
    }
    setIsSubmitting(true)
    try {
      await updateStadium({
        stadiumId: Number(stadiumId),
        name: formData.name.trim(),
        city: formData.city.trim(),
        capacity: formData.capacity === '' ? null : Number(formData.capacity),
      })
      navigate('/admin/stadiums', { state: { message: 'Stadyum güncellendi.' } })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Güncelleme başarısız.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData(original)
    setErrors({})
  }

  if (loading) {
    return (
      <div className="admin-edit-team-loading">
        <div className="ad-spinner" />
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (errors.load) {
    return (
      <div className="admin-edit-team-error">
        <h3>Hata</h3>
        <p>{errors.load}</p>
        <Link to="/admin/stadiums" className="admin-edit-team-back-btn">Listeye dön</Link>
      </div>
    )
  }

  return (
    <div className="admin-edit-team-page">
      <div className="admin-edit-team-header">
        <div className="admin-edit-team-nav">
          <Link to="/admin/stadiums" className="admin-edit-team-back">
            <span className="admin-edit-team-back-icon">←</span>
            Stadyumlar
          </Link>
        </div>
        <div className="admin-edit-team-title-section">
          <h1 className="admin-edit-team-title">Stadyum düzenle</h1>
          <p className="admin-edit-team-subtitle">{original.name || 'Kayıt'}</p>
        </div>
      </div>

      <div className="admin-edit-team-content">
        <div className="admin-edit-team-form-container">
          <form onSubmit={handleSubmit} className="admin-edit-team-form">
            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Bilgiler</h3>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Ad <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.name ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.name && <span className="admin-edit-team-error">{errors.name}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Şehir <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.city ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.city && <span className="admin-edit-team-error">{errors.city}</span>}
                </div>
              </div>
              <div className="admin-edit-team-field">
                <label className="admin-edit-team-label">Kapasite</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="0"
                  className={`admin-edit-team-input ${errors.capacity ? 'admin-edit-team-input-error' : ''}`}
                  placeholder="Opsiyonel"
                />
                {errors.capacity && <span className="admin-edit-team-error">{errors.capacity}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="admin-edit-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-edit-team-actions">
              <Link to="/admin/stadiums" className="admin-edit-team-cancel">İptal</Link>
              {hasChanges() && (
                <button type="button" onClick={handleReset} className="admin-edit-team-reset">
                  Sıfırla
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className="admin-edit-team-submit"
              >
                {isSubmitting ? (
                  <>
                    <span className="admin-edit-team-spinner" />
                    Kaydediliyor...
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
          <h3 className="admin-edit-team-preview-title">Özet</h3>
          <div className="admin-edit-team-preview-card">
            <div className="admin-edit-team-preview-logo admin-stadium-preview-emoji" aria-hidden>🏟️</div>
            <div className="admin-edit-team-preview-info">
              <h4 className="admin-edit-team-preview-name">{formData.name || '—'}</h4>
              <p className="admin-edit-team-preview-city">{formData.city || '—'}</p>
              <span className="admin-edit-team-preview-code">
                {formData.capacity !== '' ? `${Number(formData.capacity).toLocaleString('tr-TR')} kişi` : 'Kapasite —'}
              </span>
            </div>
          </div>
          {hasChanges() && (
            <div className="admin-edit-team-changes-indicator">
              <span className="admin-edit-team-changes-icon">⚠️</span>
              Kaydedilmemiş değişiklikler
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
