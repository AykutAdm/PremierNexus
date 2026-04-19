import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createMatchStatistics, fetchStatisticsByMatch } from '../api/matchStatistics.js'
import { fetchMatchById } from '../api/match.js'
import { fetchTeamById } from '../api/teams.js'

function emptyForm() {
  return {
    homePossessionPct: '',
    awayPossessionPct: '',
    homeShots: '',
    awayShots: '',
    homeShotsOnTarget: '',
    awayShotsOnTarget: '',
    homePasses: '',
    awayPasses: '',
    homePassAccuracyPct: '',
    awayPassAccuracyPct: '',
    homeCorners: '',
    awayCorners: '',
    homeFouls: '',
    awayFouls: '',
    homeOffsides: '',
    awayOffsides: '',
    homeYellowCards: '',
    awayYellowCards: '',
    homeRedCards: '',
    awayRedCards: '',
  }
}

function intOrNull(s) {
  if (s === '' || s == null) return null
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? null : n
}

function bytePctOrNull(s) {
  const n = intOrNull(s)
  if (n == null) return null
  if (n < 0 || n > 100) return null
  return n
}

export function AdminAddMatchStatistics() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [meta, setMeta] = useState({ title: '', homeLabel: '', awayLabel: '' })
  const [existingStats, setExistingStats] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const m = await fetchMatchById(matchId)
        const [home, away, stats] = await Promise.all([
          fetchTeamById(m.homeTeamId),
          fetchTeamById(m.awayTeamId),
          fetchStatisticsByMatch(matchId),
        ])
        if (cancelled) return
        setMeta({
          title: m.seasonName ? `${m.seasonName} · ${m.weekNumber}. hafta` : `Maç #${matchId}`,
          homeLabel: home?.name ?? 'Ev',
          awayLabel: away?.name ?? 'Misafir',
        })
        setExistingStats(stats)
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
    const pctKeys = ['homePossessionPct', 'awayPossessionPct', 'homePassAccuracyPct', 'awayPassAccuracyPct']
    for (const k of pctKeys) {
      if (formData[k] !== '') {
        const n = Number(formData[k])
        if (Number.isNaN(n) || n < 0 || n > 100) ne[k] = '0–100'
      }
    }
    const intKeys = Object.keys(formData).filter(k => !pctKeys.includes(k))
    for (const k of intKeys) {
      if (formData[k] !== '') {
        const n = parseInt(formData[k], 10)
        if (Number.isNaN(n) || n < 0) ne[k] = 'Geçerli sayı'
      }
    }
    setErrors(ne)
    return Object.keys(ne).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createMatchStatistics({
        matchId: Number(matchId),
        homePossessionPct: bytePctOrNull(formData.homePossessionPct),
        awayPossessionPct: bytePctOrNull(formData.awayPossessionPct),
        homeShots: intOrNull(formData.homeShots),
        awayShots: intOrNull(formData.awayShots),
        homeShotsOnTarget: intOrNull(formData.homeShotsOnTarget),
        awayShotsOnTarget: intOrNull(formData.awayShotsOnTarget),
        homePasses: intOrNull(formData.homePasses),
        awayPasses: intOrNull(formData.awayPasses),
        homePassAccuracyPct: bytePctOrNull(formData.homePassAccuracyPct),
        awayPassAccuracyPct: bytePctOrNull(formData.awayPassAccuracyPct),
        homeCorners: intOrNull(formData.homeCorners),
        awayCorners: intOrNull(formData.awayCorners),
        homeFouls: intOrNull(formData.homeFouls),
        awayFouls: intOrNull(formData.awayFouls),
        homeOffsides: intOrNull(formData.homeOffsides),
        awayOffsides: intOrNull(formData.awayOffsides),
        homeYellowCards: intOrNull(formData.homeYellowCards),
        awayYellowCards: intOrNull(formData.awayYellowCards),
        homeRedCards: intOrNull(formData.homeRedCards),
        awayRedCards: intOrNull(formData.awayRedCards),
      })
      navigate('/admin/matches', { state: { message: 'Maç istatistikleri kaydedildi.' } })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Kayıt başarısız.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const row = (homeKey, awayKey, label, homePlaceholder = '', awayPlaceholder = '') => (
    <div className="admin-add-team-row" key={homeKey}>
      <div className="admin-add-team-field">
        <label className="admin-add-team-label">{meta.homeLabel} — {label}</label>
        <input
          name={homeKey}
          value={formData[homeKey]}
          onChange={handleChange}
          className={`admin-add-team-input ${errors[homeKey] ? 'admin-add-team-input-error' : ''}`}
          placeholder={homePlaceholder}
          inputMode="numeric"
        />
        {errors[homeKey] && <span className="admin-add-team-error">{errors[homeKey]}</span>}
      </div>
      <div className="admin-add-team-field">
        <label className="admin-add-team-label">{meta.awayLabel} — {label}</label>
        <input
          name={awayKey}
          value={formData[awayKey]}
          onChange={handleChange}
          className={`admin-add-team-input ${errors[awayKey] ? 'admin-add-team-input-error' : ''}`}
          placeholder={awayPlaceholder}
          inputMode="numeric"
        />
        {errors[awayKey] && <span className="admin-add-team-error">{errors[awayKey]}</span>}
      </div>
    </div>
  )

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
          <h1 className="admin-add-team-title">MatchStatistics</h1>
          <p className="admin-add-team-subtitle">
            Maç #{matchId}
            {meta.title ? ` · ${meta.title}` : ''}
          </p>
        </div>
      </div>

      <div className="admin-add-team-content admin-add-match-content">
        <div className="admin-add-team-form-container admin-add-match-form-wide">
          {existingStats && (
            <div
              className="admin-add-team-submit-error"
              style={{ marginBottom: 16, background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)', color: 'var(--ad-orange)' }}
            >
              Bu maç için kayıtlı istatistik var (kayıt no: {existingStats.matchStatisticsId}). Yeni kayıt eklemek veritabanı kuralına göre hata verebilir; gerekirse önce mevcut kaydı silin.
            </div>
          )}
          <form onSubmit={handleSubmit} className="admin-add-team-form">
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Top sahipliği (%)</h3>
              {row('homePossessionPct', 'awayPossessionPct', 'Top sahipliği', '0–100', '0–100')}
            </div>
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Şutlar</h3>
              {row('homeShots', 'awayShots', 'Toplam şut')}
              {row('homeShotsOnTarget', 'awayShotsOnTarget', 'İsabetli şut')}
            </div>
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Paslar</h3>
              {row('homePasses', 'awayPasses', 'Toplam pas')}
              {row('homePassAccuracyPct', 'awayPassAccuracyPct', 'Pas isabeti (%)', '0–100', '0–100')}
            </div>
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Korner, faul, ofsayt</h3>
              {row('homeCorners', 'awayCorners', 'Korner')}
              {row('homeFouls', 'awayFouls', 'Faul')}
              {row('homeOffsides', 'awayOffsides', 'Ofsayt')}
            </div>
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Kartlar</h3>
              {row('homeYellowCards', 'awayYellowCards', 'Sarı kart')}
              {row('homeRedCards', 'awayRedCards', 'Kırmızı kart')}
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
                    İstatistiği kaydet
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
