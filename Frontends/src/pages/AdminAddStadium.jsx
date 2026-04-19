import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createStadium } from '../api/stadiums.js'

export function AdminAddStadium() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    capacity: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createStadium({
        name: formData.name.trim(),
        city: formData.city.trim(),
        capacity: formData.capacity === '' ? null : Number(formData.capacity),
      })
      navigate('/admin/stadiums', { state: { message: 'Stadyum eklendi.' } })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Kayıt başarısız.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-add-team-page">
      <div className="admin-add-team-header">
        <div className="admin-add-team-nav">
          <Link to="/admin/stadiums" className="admin-add-team-back">
            <span className="admin-add-team-back-icon">←</span>
            Stadyumlar
          </Link>
        </div>
        <div className="admin-add-team-title-section">
          <h1 className="admin-add-team-title">Yeni stadyum</h1>
          <p className="admin-add-team-subtitle">Yeni bir stadyum kaydı oluşturun</p>
        </div>
      </div>

      <div className="admin-add-team-content">
        <div className="admin-add-team-form-container">
          <form onSubmit={handleSubmit} className="admin-add-team-form">
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Bilgiler</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Ad (Name) <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.name ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: Old Trafford"
                  />
                  {errors.name && <span className="admin-add-team-error">{errors.name}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Şehir (City) <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.city ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: Manchester"
                  />
                  {errors.city && <span className="admin-add-team-error">{errors.city}</span>}
                </div>
              </div>
              <div className="admin-add-team-field">
                <label className="admin-add-team-label">Kapasite (Capacity)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="0"
                  className={`admin-add-team-input ${errors.capacity ? 'admin-add-team-input-error' : ''}`}
                  placeholder="Boş bırakılabilir"
                />
                {errors.capacity && <span className="admin-add-team-error">{errors.capacity}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="admin-add-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-add-team-actions">
              <Link to="/admin/stadiums" className="admin-add-team-cancel">İptal</Link>
              <button type="submit" disabled={isSubmitting} className="admin-add-team-submit">
                {isSubmitting ? (
                  <>
                    <span className="admin-add-team-spinner" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <span className="admin-add-team-submit-icon">✓</span>
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-add-team-preview">
          <h3 className="admin-add-team-preview-title">Özet</h3>
          <div className="admin-add-team-preview-card">
            <div className="admin-add-team-preview-logo admin-stadium-preview-emoji" aria-hidden>🏟️</div>
            <div className="admin-add-team-preview-info">
              <h4 className="admin-add-team-preview-name">{formData.name || 'Stadyum adı'}</h4>
              <p className="admin-add-team-preview-city">{formData.city || 'Şehir'}</p>
              <span className="admin-add-team-preview-code">
                {formData.capacity !== '' ? `${Number(formData.capacity).toLocaleString('tr-TR')} kişi` : 'Kapasite —'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
