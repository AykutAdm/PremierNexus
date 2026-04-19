import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createLeague } from '../api/leagues.js'

export function AdminAddLeague() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    country: '',
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
    if (!formData.name.trim()) ne.name = 'Lig adı gerekli'
    setErrors(ne)
    return Object.keys(ne).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createLeague({
        name: formData.name.trim(),
        country: formData.country.trim() === '' ? null : formData.country.trim(),
      })
      navigate('/admin/leagues', { state: { message: 'Lig eklendi.' } })
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
          <Link to="/admin/leagues" className="admin-add-team-back">
            <span className="admin-add-team-back-icon">←</span>
            Ligler
          </Link>
        </div>
        <div className="admin-add-team-title-section">
          <h1 className="admin-add-team-title">Yeni lig</h1>
          <p className="admin-add-team-subtitle">Yeni bir lig kaydı oluşturun</p>
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
                    placeholder="Örn: Premier League"
                  />
                  {errors.name && <span className="admin-add-team-error">{errors.name}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Ülke (Country)</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="admin-add-team-input"
                    placeholder="Örn: England — opsiyonel"
                  />
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="admin-add-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-add-team-actions">
              <Link to="/admin/leagues" className="admin-add-team-cancel">İptal</Link>
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
            <div className="admin-add-team-preview-logo admin-league-preview-emoji" aria-hidden>🏆</div>
            <div className="admin-add-team-preview-info">
              <h4 className="admin-add-team-preview-name">{formData.name || 'Lig adı'}</h4>
              <p className="admin-add-team-preview-city">
                {formData.country.trim() || 'Ülke —'}
              </p>
              <span className="admin-add-team-preview-code">Lig kaydı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
