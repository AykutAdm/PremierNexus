import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchMatchById, updateMatch } from '../api/match.js'
import { fetchSeasons } from '../api/seasons.js'
import { fetchTeams } from '../api/teams.js'
import { fetchStadiums } from '../api/stadiums.js'

const STATUSES = [
  { value: 'Scheduled', label: 'Planlandı' },
  { value: 'Live', label: 'Canlı' },
  { value: 'Finished', label: 'Bitti' },
  { value: 'Postponed', label: 'Ertelendi' },
]

function isoToDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toForm(m) {
  return {
    seasonId: m?.seasonId != null ? String(m.seasonId) : '',
    weekNumber: m?.weekNumber != null ? String(m.weekNumber) : '',
    homeTeamId: m?.homeTeamId != null ? String(m.homeTeamId) : '',
    awayTeamId: m?.awayTeamId != null ? String(m.awayTeamId) : '',
    stadiumId: m?.stadiumId != null ? String(m.stadiumId) : '',
    matchDate: isoToDatetimeLocal(m?.matchDate),
    status: m?.status ?? 'Scheduled',
    homeScore: m?.homeScore != null ? String(m.homeScore) : '',
    awayScore: m?.awayScore != null ? String(m.awayScore) : '',
    homeScoreHT: m?.homeScoreHT != null ? String(m.homeScoreHT) : '',
    awayScoreHT: m?.awayScoreHT != null ? String(m.awayScoreHT) : '',
    referee: m?.referee ?? '',
    attendance: m?.attendance != null ? String(m.attendance) : '',
  }
}

function numOrNull(s) {
  if (s === '' || s == null) return null
  const n = Number(s)
  return Number.isNaN(n) ? null : n
}

export function AdminEditMatch() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [seasons, setSeasons] = useState([])
  const [teams, setTeams] = useState([])
  const [stadiums, setStadiums] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [formData, setFormData] = useState(toForm({}))
  const [original, setOriginal] = useState(toForm({}))
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const loadOptions = async () => {
      try {
        const [s, t, st] = await Promise.all([
          fetchSeasons(),
          fetchTeams(),
          fetchStadiums(),
        ])
        if (cancelled) return
        setSeasons(Array.isArray(s) ? s : [])
        setTeams(Array.isArray(t) ? t : [])
        setStadiums(Array.isArray(st) ? st : [])
      } catch (e) {
        console.error(e)
        if (!cancelled) setErrors({ load: 'Sezon / takım / stadyum listesi yüklenemedi.' })
      } finally {
        if (!cancelled) setOptionsLoading(false)
      }
    }
    loadOptions()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const m = await fetchMatchById(matchId)
        if (cancelled) return
        const fd = toForm(m)
        setFormData(fd)
        setOriginal(fd)
      } catch (e) {
        console.error(e)
        setErrors(er => ({ ...er, match: 'Maç bulunamadı veya yüklenemedi.' }))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [matchId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'homeTeamId' && value && value === prev.awayTeamId) next.awayTeamId = ''
      return next
    })
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const ne = {}
    if (!formData.seasonId) ne.seasonId = 'Sezon seçin'
    if (!formData.weekNumber.trim()) ne.weekNumber = 'Hafta numarası gerekli'
    else {
      const w = Number(formData.weekNumber)
      if (Number.isNaN(w) || w < 1 || w > 99) ne.weekNumber = 'Geçerli bir hafta (1–99)'
    }
    if (!formData.homeTeamId) ne.homeTeamId = 'Ev sahibi takım seçin'
    if (!formData.awayTeamId) ne.awayTeamId = 'Misafir takım seçin'
    if (formData.homeTeamId && formData.awayTeamId && formData.homeTeamId === formData.awayTeamId) {
      ne.awayTeamId = 'Ev ve misafir takım farklı olmalı'
    }
    if (!formData.stadiumId) ne.stadiumId = 'Stadyum seçin'
    if (!formData.matchDate) ne.matchDate = 'Maç tarihi ve saati gerekli'
    if (!formData.status) ne.status = 'Durum seçin'

    const scoreFields = ['homeScore', 'awayScore', 'homeScoreHT', 'awayScoreHT', 'attendance']
    for (const f of scoreFields) {
      if (formData[f] !== '') {
        const n = Number(formData[f])
        if (Number.isNaN(n) || n < 0) ne[f] = 'Geçerli bir sayı girin'
      }
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
      navigate('/admin/matches', { state: { message: 'Değişiklik yok.' } })
      return
    }
    setIsSubmitting(true)
    try {
      await updateMatch({
        matchId: Number(matchId),
        seasonId: Number(formData.seasonId),
        weekNumber: Number(formData.weekNumber),
        homeTeamId: Number(formData.homeTeamId),
        awayTeamId: Number(formData.awayTeamId),
        stadiumId: Number(formData.stadiumId),
        matchDate: new Date(formData.matchDate).toISOString(),
        status: formData.status,
        homeScore: numOrNull(formData.homeScore),
        awayScore: numOrNull(formData.awayScore),
        homeScoreHT: numOrNull(formData.homeScoreHT),
        awayScoreHT: numOrNull(formData.awayScoreHT),
        referee: formData.referee.trim() === '' ? null : formData.referee.trim(),
        attendance: numOrNull(formData.attendance),
      })
      navigate('/admin/matches', { state: { message: 'Maç güncellendi.' } })
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

  const awayOptions = teams.filter(
    t => !formData.homeTeamId || String(t.teamId) !== formData.homeTeamId,
  )
  const homeOptions = teams.filter(
    t => !formData.awayTeamId || String(t.teamId) !== formData.awayTeamId,
  )

  if (loading || optionsLoading) {
    return (
      <div className="admin-edit-team-loading">
        <div className="ad-spinner" />
        <p>Yükleniyor...</p>
      </div>
    )
  }

  if (errors.load || errors.match) {
    return (
      <div className="admin-edit-team-error">
        <h3>Hata</h3>
        <p>{errors.load || errors.match}</p>
        <Link to="/admin/matches" className="admin-edit-team-back-btn">Listeye dön</Link>
      </div>
    )
  }

  return (
    <div className="admin-edit-team-page admin-edit-match-page">
      <div className="admin-edit-team-header">
        <div className="admin-edit-team-nav">
          <Link to="/admin/matches" className="admin-edit-team-back">
            <span className="admin-edit-team-back-icon">←</span>
            Maçlar
          </Link>
        </div>
        <div className="admin-edit-team-title-section">
          <h1 className="admin-edit-team-title">Maç düzenle</h1>
          <p className="admin-edit-team-subtitle">Maç #{matchId}</p>
        </div>
      </div>

      <div className="admin-edit-team-content admin-add-match-content">
        <div className="admin-edit-team-form-container admin-add-match-form-wide">
          <form onSubmit={handleSubmit} className="admin-edit-team-form">
            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Maç bilgisi</h3>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Sezon <span className="admin-edit-team-required">*</span>
                  </label>
                  <select
                    name="seasonId"
                    value={formData.seasonId}
                    onChange={handleChange}
                    className={`admin-edit-team-input admin-edit-team-select ${errors.seasonId ? 'admin-edit-team-input-error' : ''}`}
                  >
                    <option value="">Sezon seçin</option>
                    {seasons.map(s => (
                      <option key={s.seasonId} value={s.seasonId}>
                        {s.name} — {s.leagueName}
                      </option>
                    ))}
                  </select>
                  {errors.seasonId && <span className="admin-edit-team-error">{errors.seasonId}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Hafta <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    type="number"
                    name="weekNumber"
                    min="1"
                    max="99"
                    value={formData.weekNumber}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.weekNumber ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.weekNumber && <span className="admin-edit-team-error">{errors.weekNumber}</span>}
                </div>
              </div>

              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Ev sahibi <span className="admin-edit-team-required">*</span>
                  </label>
                  <select
                    name="homeTeamId"
                    value={formData.homeTeamId}
                    onChange={handleChange}
                    className={`admin-edit-team-input admin-edit-team-select ${errors.homeTeamId ? 'admin-edit-team-input-error' : ''}`}
                  >
                    <option value="">Takım seçin</option>
                    {homeOptions.map(t => (
                      <option key={t.teamId} value={t.teamId}>{t.name}</option>
                    ))}
                  </select>
                  {errors.homeTeamId && <span className="admin-edit-team-error">{errors.homeTeamId}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Misafir <span className="admin-edit-team-required">*</span>
                  </label>
                  <select
                    name="awayTeamId"
                    value={formData.awayTeamId}
                    onChange={handleChange}
                    className={`admin-edit-team-input admin-edit-team-select ${errors.awayTeamId ? 'admin-edit-team-input-error' : ''}`}
                  >
                    <option value="">Takım seçin</option>
                    {awayOptions.map(t => (
                      <option key={t.teamId} value={t.teamId}>{t.name}</option>
                    ))}
                  </select>
                  {errors.awayTeamId && <span className="admin-edit-team-error">{errors.awayTeamId}</span>}
                </div>
              </div>

              <div className="admin-edit-team-field">
                <label className="admin-edit-team-label">
                  Stadyum <span className="admin-edit-team-required">*</span>
                </label>
                <select
                  name="stadiumId"
                  value={formData.stadiumId}
                  onChange={handleChange}
                  className={`admin-edit-team-input admin-edit-team-select ${errors.stadiumId ? 'admin-edit-team-input-error' : ''}`}
                >
                  <option value="">Stadyum seçin</option>
                  {stadiums.map(st => (
                    <option key={st.stadiumId} value={st.stadiumId}>
                      {st.name} ({st.city})
                    </option>
                  ))}
                </select>
                {errors.stadiumId && <span className="admin-edit-team-error">{errors.stadiumId}</span>}
              </div>

              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Tarih ve saat <span className="admin-edit-team-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="matchDate"
                    value={formData.matchDate}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.matchDate ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.matchDate && <span className="admin-edit-team-error">{errors.matchDate}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">
                    Durum <span className="admin-edit-team-required">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="admin-edit-team-input admin-edit-team-select"
                  >
                    {STATUSES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-edit-team-section">
              <h3 className="admin-edit-team-section-title">Skor ve detay</h3>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Ev skor</label>
                  <input
                    type="number"
                    name="homeScore"
                    min="0"
                    value={formData.homeScore}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.homeScore ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.homeScore && <span className="admin-edit-team-error">{errors.homeScore}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Misafir skor</label>
                  <input
                    type="number"
                    name="awayScore"
                    min="0"
                    value={formData.awayScore}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.awayScore ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.awayScore && <span className="admin-edit-team-error">{errors.awayScore}</span>}
                </div>
              </div>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">İY ev</label>
                  <input
                    type="number"
                    name="homeScoreHT"
                    min="0"
                    value={formData.homeScoreHT}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.homeScoreHT ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.homeScoreHT && <span className="admin-edit-team-error">{errors.homeScoreHT}</span>}
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">İY misafir</label>
                  <input
                    type="number"
                    name="awayScoreHT"
                    min="0"
                    value={formData.awayScoreHT}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.awayScoreHT ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.awayScoreHT && <span className="admin-edit-team-error">{errors.awayScoreHT}</span>}
                </div>
              </div>
              <div className="admin-edit-team-row">
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Hakem</label>
                  <input
                    name="referee"
                    value={formData.referee}
                    onChange={handleChange}
                    className="admin-edit-team-input"
                  />
                </div>
                <div className="admin-edit-team-field">
                  <label className="admin-edit-team-label">Seyirci</label>
                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    value={formData.attendance}
                    onChange={handleChange}
                    className={`admin-edit-team-input ${errors.attendance ? 'admin-edit-team-input-error' : ''}`}
                  />
                  {errors.attendance && <span className="admin-edit-team-error">{errors.attendance}</span>}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="admin-edit-team-submit-error">{errors.submit}</div>
            )}

            <div className="admin-edit-team-actions">
              <Link to="/admin/matches" className="admin-edit-team-cancel">İptal</Link>
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
      </div>
    </div>
  )
}
