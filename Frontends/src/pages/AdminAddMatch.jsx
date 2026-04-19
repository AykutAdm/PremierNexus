import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createMatch } from '../api/match.js'
import { fetchSeasons } from '../api/seasons.js'
import { fetchTeams } from '../api/teams.js'
import { fetchStadiums } from '../api/stadiums.js'

const STATUSES = [
  { value: 'Scheduled', label: 'Planlandı' },
  { value: 'Live', label: 'Canlı' },
  { value: 'Finished', label: 'Bitti' },
  { value: 'Postponed', label: 'Ertelendi' },
]

function emptyForm() {
  return {
    seasonId: '',
    weekNumber: '',
    homeTeamId: '',
    awayTeamId: '',
    stadiumId: '',
    matchDate: '',
    status: 'Scheduled',
    homeScore: '',
    awayScore: '',
    homeScoreHT: '',
    awayScoreHT: '',
    referee: '',
    attendance: '',
  }
}

function numOrNull(s) {
  if (s === '' || s == null) return null
  const n = Number(s)
  return Number.isNaN(n) ? null : n
}

export function AdminAddMatch() {
  const navigate = useNavigate()
  const [seasons, setSeasons] = useState([])
  const [teams, setTeams] = useState([])
  const [stadiums, setStadiums] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
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
    load()
    return () => { cancelled = true }
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      await createMatch({
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
      navigate('/admin/matches', { state: { message: 'Maç eklendi.' } })
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Kayıt başarısız.',
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const awayOptions = teams.filter(
    t => !formData.homeTeamId || String(t.teamId) !== formData.homeTeamId,
  )
  const homeOptions = teams.filter(
    t => !formData.awayTeamId || String(t.teamId) !== formData.awayTeamId,
  )

  if (optionsLoading) {
    return (
      <div className="admin-teams-loading">
        <div className="ad-spinner" />
        <p>Form seçenekleri yükleniyor...</p>
      </div>
    )
  }

  if (errors.load) {
    return (
      <div className="admin-edit-team-error">
        <h3>Hata</h3>
        <p>{errors.load}</p>
        <Link to="/admin/matches" className="admin-edit-team-back-btn">Listeye dön</Link>
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
          <h1 className="admin-add-team-title">Yeni maç</h1>
          <p className="admin-add-team-subtitle">Sezon, takımlar ve stadyumu seçin</p>
        </div>
      </div>

      <div className="admin-add-team-content admin-add-match-content">
        <div className="admin-add-team-form-container admin-add-match-form-wide">
          <form onSubmit={handleSubmit} className="admin-add-team-form">
            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Maç bilgisi</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Sezon <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="seasonId"
                    value={formData.seasonId}
                    onChange={handleChange}
                    className={`admin-add-team-input admin-add-team-select ${errors.seasonId ? 'admin-add-team-input-error' : ''}`}
                  >
                    <option value="">Sezon seçin</option>
                    {seasons.map(s => (
                      <option key={s.seasonId} value={s.seasonId}>
                        {s.name} — {s.leagueName}
                      </option>
                    ))}
                  </select>
                  {errors.seasonId && <span className="admin-add-team-error">{errors.seasonId}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Hafta <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="number"
                    name="weekNumber"
                    min="1"
                    max="99"
                    value={formData.weekNumber}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.weekNumber ? 'admin-add-team-input-error' : ''}`}
                    placeholder="Örn: 12"
                  />
                  {errors.weekNumber && <span className="admin-add-team-error">{errors.weekNumber}</span>}
                </div>
              </div>

              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Ev sahibi <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="homeTeamId"
                    value={formData.homeTeamId}
                    onChange={handleChange}
                    className={`admin-add-team-input admin-add-team-select ${errors.homeTeamId ? 'admin-add-team-input-error' : ''}`}
                  >
                    <option value="">Takım seçin</option>
                    {homeOptions.map(t => (
                      <option key={t.teamId} value={t.teamId}>{t.name}</option>
                    ))}
                  </select>
                  {errors.homeTeamId && <span className="admin-add-team-error">{errors.homeTeamId}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Misafir <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="awayTeamId"
                    value={formData.awayTeamId}
                    onChange={handleChange}
                    className={`admin-add-team-input admin-add-team-select ${errors.awayTeamId ? 'admin-add-team-input-error' : ''}`}
                  >
                    <option value="">Takım seçin</option>
                    {awayOptions.map(t => (
                      <option key={t.teamId} value={t.teamId}>{t.name}</option>
                    ))}
                  </select>
                  {errors.awayTeamId && <span className="admin-add-team-error">{errors.awayTeamId}</span>}
                </div>
              </div>

              <div className="admin-add-team-field">
                <label className="admin-add-team-label">
                  Stadyum <span className="admin-add-team-required">*</span>
                </label>
                <select
                  name="stadiumId"
                  value={formData.stadiumId}
                  onChange={handleChange}
                  className={`admin-add-team-input admin-add-team-select ${errors.stadiumId ? 'admin-add-team-input-error' : ''}`}
                >
                  <option value="">Stadyum seçin</option>
                  {stadiums.map(st => (
                    <option key={st.stadiumId} value={st.stadiumId}>
                      {st.name} ({st.city})
                    </option>
                  ))}
                </select>
                {errors.stadiumId && <span className="admin-add-team-error">{errors.stadiumId}</span>}
              </div>

              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Tarih ve saat <span className="admin-add-team-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="matchDate"
                    value={formData.matchDate}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.matchDate ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.matchDate && <span className="admin-add-team-error">{errors.matchDate}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">
                    Durum <span className="admin-add-team-required">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="admin-add-team-input admin-add-team-select"
                  >
                    {STATUSES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-add-team-section">
              <h3 className="admin-add-team-section-title">Skor ve detay (opsiyonel)</h3>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Ev skor</label>
                  <input
                    type="number"
                    name="homeScore"
                    min="0"
                    value={formData.homeScore}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.homeScore ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.homeScore && <span className="admin-add-team-error">{errors.homeScore}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Misafir skor</label>
                  <input
                    type="number"
                    name="awayScore"
                    min="0"
                    value={formData.awayScore}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.awayScore ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.awayScore && <span className="admin-add-team-error">{errors.awayScore}</span>}
                </div>
              </div>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">İY ev</label>
                  <input
                    type="number"
                    name="homeScoreHT"
                    min="0"
                    value={formData.homeScoreHT}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.homeScoreHT ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.homeScoreHT && <span className="admin-add-team-error">{errors.homeScoreHT}</span>}
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">İY misafir</label>
                  <input
                    type="number"
                    name="awayScoreHT"
                    min="0"
                    value={formData.awayScoreHT}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.awayScoreHT ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.awayScoreHT && <span className="admin-add-team-error">{errors.awayScoreHT}</span>}
                </div>
              </div>
              <div className="admin-add-team-row">
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Hakem</label>
                  <input
                    name="referee"
                    value={formData.referee}
                    onChange={handleChange}
                    className="admin-add-team-input"
                    placeholder="Opsiyonel"
                  />
                </div>
                <div className="admin-add-team-field">
                  <label className="admin-add-team-label">Seyirci</label>
                  <input
                    type="number"
                    name="attendance"
                    min="0"
                    value={formData.attendance}
                    onChange={handleChange}
                    className={`admin-add-team-input ${errors.attendance ? 'admin-add-team-input-error' : ''}`}
                  />
                  {errors.attendance && <span className="admin-add-team-error">{errors.attendance}</span>}
                </div>
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
                    Kaydet
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
