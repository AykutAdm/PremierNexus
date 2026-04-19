import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createMatchEvent } from '../api/matchEvents.js'
import { fetchMatchById } from '../api/match.js'
import { fetchTeamById } from '../api/teams.js'

const ACTION_TYPES = [
  { value: 'Goal', label: 'Gol' },
  { value: 'YellowCard', label: 'Sarı kart' },
  { value: 'RedCard', label: 'Kırmızı kart' },
  { value: 'Substitution', label: 'Oyuncu değişikliği' },
]

export function AdminAddMatchEvent() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [meta, setMeta] = useState({
    seasonLabel: '',
    homeLabel: '',
    awayLabel: '',
    homeTeamId: null,
    awayTeamId: null,
  })
  const [formData, setFormData] = useState({
    teamId: '',
    minute: '',
    extraMinute: '',
    actionType: 'Goal',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const m = await fetchMatchById(matchId)
        const [home, away] = await Promise.all([
          fetchTeamById(m.homeTeamId),
          fetchTeamById(m.awayTeamId),
        ])
        if (cancelled) return
        setMeta({
          seasonLabel: m.seasonName ? `${m.seasonName} · ${m.weekNumber}. hafta` : `Maç #${matchId}`,
          homeLabel: home?.name ?? `Ev (${m.homeTeamId})`,
          awayLabel: away?.name ?? `Misafir (${m.awayTeamId})`,
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
        })
      } catch (e) {
        console.error(e)
        if (!cancelled) setLoadError('Maç yüklenemedi veya bulunamadı.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [matchId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const ne = {}
    if (!formData.teamId) ne.teamId = 'Takım seçin'
    if (formData.minute === '') ne.minute = 'Dakika gerekli'
    else {
      const min = Number(formData.minute)
      if (Number.isNaN(min) || min < 0 || min > 120) ne.minute = '0–120 arası dakika'
    }
    if (formData.extraMinute !== '') {
      const ex = Number(formData.extraMinute)
      if (Number.isNaN(ex) || ex < 0 || ex > 30) ne.extraMinute = 'Geçerli ek dakika (örn. 0–15)'
    }
    if (!formData.actionType) ne.actionType = 'Olay tipi seçin'
    if (!formData.description.trim()) ne.description = 'Açıklama gerekli'
    setErrors(ne)
    return Object.keys(ne).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createMatchEvent({
        matchId: Number(matchId),
        teamId: Number(formData.teamId),
        minute: Number(formData.minute),
        extraMinute: formData.extraMinute === '' ? null : Number(formData.extraMinute),
        actionType: formData.actionType,
        description: formData.description.trim(),
      })
      navigate('/admin/matches', { state: { message: 'Maç olayı eklendi.' } })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Kayıt başarısız.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-teams-loading">
        <div className="ad-spinner" />
        <p>Maç bilgisi yükleniyor...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="admin-edit-team-error">
        <h3>Hata</h3>
        <p>{loadError}</p>
        <Link to="/admin/matches" className="admin-edit-team-back-btn">Maç listesine dön</Link>
      </div>
    )
  }

  return (
    <div className="admin-add-team-page admin-add-match-page">
      <div className="admin-add-team-header">
        <div className="admin-add-team-nav">
          <Link to="/admin/matches" className="admin-add-team-back">
            <span className="admin-add-team-back-icon">←</span>
            Maçlar
          </Link>
        </div>
        <div className="admin-add-team-title-section">
          <h1 className="admin-add-team-title">Maç olayı ekle</h1>
          <p className="admin-add-team-subtitle">
            Maç #{matchId}
            {meta.seasonLabel ? ` · ${meta.seasonLabel}` : ''}
          </p>
        </div>
      </div>

      <div className="admin-add-team-content admin-add-match-content">
        <div className="admin-add-team-form-container admin-add-match-form-wide">
          <form onSubmit={handleSubmit} className="admin-add-team-form">
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Olay</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Takım <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleChange}
                    className={`admin-add-team-input admin-add-team-select ${errors.teamId ? 'admin-add-team-input-error' : ''}`}
                  >
                    <option value="">Takım seçin</option>
                    {meta.homeTeamId != null && (
                      <option value={meta.homeTeamId}>{meta.homeLabel} (ev)</option>
                    )}
                    {meta.awayTeamId != null && (
                      <option value={meta.awayTeamId}>{meta.awayLabel} (misafir)</option>
                    )}
                  </select>
                  {errors.teamId && <span className="admin-add-team-error">{errors.teamId}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Olay tipi <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="actionType"
                    value={formData.actionType}
                    onChange={handleChange}
                    className={`admin-add-team-input admin-add-team-select ${errors.actionType ? 'admin-add-team-input-error' : ''}`}
                  >
                    {ACTION_TYPES.map(a => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                  {errors.actionType && <span className="admin-add-team-error">{errors.actionType}</span>}
                </div>
              </div>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Dakika <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="number"
                    name="minute"
                    min="0"
                    max="120"
                    value={formData.minute}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.minute ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: 23"
                  />
                  {errors.minute && <span className="admin-add-team-error">{errors.minute}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Ek dakika</label>
                  <input
                    type="number"
                    name="extraMinute"
                    min="0"
                    max="30"
                    value={formData.extraMinute}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.extraMinute ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Opsiyonel"
                  />
                  {errors.extraMinute && <span className="admin-add-team-error">{errors.extraMinute}</span>}
                </div>
              </div>
              <div className="admin-add-team-field">
                <label className="admin-add-team-label">
                  Açıklama <span className="admin-add-team-required">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`admin-add-team-textarea ${errors.description ? 'admin-add-team-input-error' : ''}`}
                  placeholder="Örn: Oyuncu adı, detay..."
                />
                {errors.description && <span className="admin-add-team-error">{errors.description}</span>}
              </div>
            </div>

            {errors.submit && (
              <div className="admin-add-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-add-team-actions">
              <Link to="/admin/matches" className="admin-add-team-cancel">İptal</Link>
              <button type="submit" disabled={isSubmitting} className="admin-add-team-submit">
                {isSubmitting ? (
                  <>
                    <span className="admin-add-team-spinner" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <span className="admin-add-team-submit-icon">✓</span>
                    Olayı kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
