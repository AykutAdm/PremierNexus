import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMatches } from '../api/match.js'
import { fetchTeams } from '../api/teams.js'
import { fetchCurrentStandings } from '../api/standings.js'

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalMatches: 0, completedMatches: 0, upcomingMatches: 0, liveMatches: 0, totalTeams: 0 })
  const [recentMatches, setRecentMatches] = useState([])
  const [topTeams, setTopTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [matches, teams, standings] = await Promise.all([fetchMatches(), fetchTeams(), fetchCurrentStandings(1)])
        setStats({
          totalMatches: matches.length,
          completedMatches: matches.filter(m => m.status === 'Finished').length,
          upcomingMatches: matches.filter(m => m.status === 'Not Played').length,
          liveMatches: matches.filter(m => m.status === 'Ongoing').length,
          totalTeams: teams.length,
        })
        setRecentMatches(matches.filter(m => m.status === 'Finished').slice(0, 5))
        setTopTeams(standings.slice(0, 5))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Fake sparkline path generator
  const sparkline = (data, w = 120, h = 40) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    return `M ${pts.join(' L ')}`
  }

  const barsData = [4, 6, 5, 8, 7, 9, 6, 10, 8, 7, 9, 11]
  const lineData  = [3, 5, 4, 7, 6, 8, 7, 9, 8, 10, 9, 12]
  const areaData  = [2, 4, 3, 6, 5, 8, 6, 9, 7, 11, 8, 12, 9, 11, 10]
  const area2Data = [1, 2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9]

  if (loading) return (
    <div className="ad-loading">
      <div className="ad-spinner" />
      <p>Yükleniyor…</p>
    </div>
  )

  return (
    <div className="ad-page">
      {/* Breadcrumb */}
      <div className="ad-breadcrumb">
        <span>Dashboard</span>
        <span className="ad-bc-sep">›</span>
        <span className="ad-bc-active">Genel Bakış</span>
      </div>

      {/* === ROW 1 === */}
      <div className="ad-row1">
        {/* Hero Card */}
        <div className="ad-hero-card">
          <div className="ad-hero-text">
            <p className="ad-hero-sub">Premier Nexus Admin</p>
            <h2 className="ad-hero-title">Lig Yönetimine<br />Hoş Geldiniz</h2>
            <p className="ad-hero-desc">Tüm maç verilerini, puan tablolarını ve istatistikleri buradan yönetebilirsiniz.</p>
            <div className="ad-hero-badges">
              <span className="ad-hero-badge">+{stats.completedMatches} Bitti</span>
              <span className="ad-hero-badge ad-badge-green">● Aktif Sezon</span>
            </div>
            <Link to="/admin/matches" className="ad-hero-btn">Maçları yönet →</Link>
          </div>
          <div className="ad-hero-art">
            <svg viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="70" r="55" fill="rgba(102,126,234,0.15)" />
              <circle cx="90" cy="70" r="38" fill="rgba(102,126,234,0.2)" />
              <text x="90" y="80" textAnchor="middle" fontSize="40" fill="rgba(255,255,255,0.9)">⚽</text>
              <circle cx="140" cy="30" r="14" fill="rgba(118,75,162,0.3)" />
              <text x="140" y="35" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.8)">🏆</text>
              <circle cx="40" cy="110" r="12" fill="rgba(16,185,129,0.3)" />
              <text x="40" y="115" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.8)">📊</text>
            </svg>
          </div>
        </div>

        {/* Total Matches */}
        <div className="ad-metric-card">
          <div className="ad-metric-header">
            <div>
              <p className="ad-metric-label">Toplam Maç</p>
              <h3 className="ad-metric-value">{stats.totalMatches}</h3>
              <span className="ad-metric-trend ad-trend-up">↑ +{stats.completedMatches} tamamlandı</span>
            </div>
            <div className="ad-metric-icon ad-icon-blue">⚽</div>
          </div>
          <div className="ad-chart-wrap">
            <svg viewBox={`0 0 120 40`} preserveAspectRatio="none" className="ad-sparkline">
              <defs>
                <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#667eea" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={sparkline(lineData) + ' L 120,40 L 0,40 Z'} fill="url(#gBlue)" />
              <path d={sparkline(lineData)} stroke="#667eea" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        {/* Total Teams */}
        <div className="ad-metric-card">
          <div className="ad-metric-header">
            <div>
              <p className="ad-metric-label">Toplam Takım</p>
              <h3 className="ad-metric-value">{stats.totalTeams}</h3>
              <span className="ad-metric-trend ad-trend-neutral">→ Aktif sezon</span>
            </div>
            <div className="ad-metric-icon ad-icon-purple">🏟️</div>
          </div>
          <div className="ad-chart-wrap ad-bars-wrap">
            {barsData.map((v, i) => (
              <div
                key={i}
                className="ad-bar"
                style={{ height: `${(v / Math.max(...barsData)) * 100}%`, animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* === ROW 2 === */}
      <div className="ad-row2">
        {/* Area Chart - Activity */}
        <div className="ad-chart-card">
          <div className="ad-chart-card-header">
            <div>
              <h3 className="ad-chart-card-title">Maç Aktivitesi</h3>
              <p className="ad-chart-card-sub">Sezon boyunca oynanan maçların dağılımı</p>
            </div>
            <div className="ad-chart-legend">
              <span className="ad-legend-dot ad-dot-blue"></span><span>Maçlar</span>
              <span className="ad-legend-dot ad-dot-orange"></span><span>Olaylar</span>
            </div>
          </div>
          <div className="ad-area-chart">
            <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="ad-area-svg">
              <defs>
                <linearGradient id="gArea1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#667eea" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="gArea2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={sparkline(areaData, 600, 120) + ' L 600,120 L 0,120 Z'} fill="url(#gArea1)" />
              <path d={sparkline(areaData, 600, 120)} stroke="#667eea" strokeWidth="2.5" fill="none" />
              <path d={sparkline(area2Data, 600, 120) + ' L 600,120 L 0,120 Z'} fill="url(#gArea2)" />
              <path d={sparkline(area2Data, 600, 120)} stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            </svg>
            <div className="ad-area-labels">
              {['Hf1','Hf2','Hf3','Hf4','Hf5','Hf6','Hf7','Hf8','Hf9','Hf10','Hf11','Hf12'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Lig İstatistikleri */}
        <div className="ad-stats-card">
          <div className="ad-stats-card-header">
            <div>
              <h3 className="ad-chart-card-title">Lig Durumu</h3>
              <p className="ad-chart-card-sub">Genel sezon verileri</p>
            </div>
          </div>

          <div className="ad-big-stat">
            <span className="ad-big-number">{stats.completedMatches}</span>
            <span className="ad-big-label">Tamamlanan Maç</span>
          </div>

          <div className="ad-progress-list">
            <div className="ad-progress-item">
              <div className="ad-progress-meta">
                <span className="ad-progress-icon">✅</span>
                <span className="ad-progress-name">Tamamlanan</span>
                <span className="ad-progress-val">{stats.completedMatches}</span>
              </div>
              <div className="ad-progress-bar-bg">
                <div className="ad-progress-fill ad-fill-green" style={{ width: `${stats.totalMatches ? (stats.completedMatches / stats.totalMatches) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="ad-progress-item">
              <div className="ad-progress-meta">
                <span className="ad-progress-icon">⏰</span>
                <span className="ad-progress-name">Yaklaşan</span>
                <span className="ad-progress-val">{stats.upcomingMatches}</span>
              </div>
              <div className="ad-progress-bar-bg">
                <div className="ad-progress-fill ad-fill-blue" style={{ width: `${stats.totalMatches ? (stats.upcomingMatches / stats.totalMatches) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="ad-progress-item">
              <div className="ad-progress-meta">
                <span className="ad-progress-icon">🔴</span>
                <span className="ad-progress-name">Canlı</span>
                <span className="ad-progress-val">{stats.liveMatches}</span>
              </div>
              <div className="ad-progress-bar-bg">
                <div className="ad-progress-fill ad-fill-red" style={{ width: `${stats.totalMatches ? (stats.liveMatches / stats.totalMatches) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === ROW 3 === */}
      <div className="ad-row3">
        {/* Son Maçlar */}
        <div className="ad-table-card">
          <div className="ad-table-header">
            <div>
              <h3 className="ad-chart-card-title">Son Maçlar</h3>
              <p className="ad-chart-card-sub">En son oynanan maçlar</p>
            </div>
            <Link to="/fikstur" className="ad-link-btn">Tümünü Gör →</Link>
          </div>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Ev Sahibi</th>
                <th>Skor</th>
                <th>Deplasman</th>
                <th>Hafta</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {recentMatches.map(m => (
                <tr key={m.matchId} className="ad-table-row">
                  <td>
                    <div className="ad-table-team">
                      <img src={m.homeTeamLogo} alt={m.homeTeamName} />
                      <span>{m.homeTeamName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="ad-table-score">{m.homeScore} – {m.awayScore}</span>
                  </td>
                  <td>
                    <div className="ad-table-team ad-team-right">
                      <span>{m.awayTeamName}</span>
                      <img src={m.awayTeamLogo} alt={m.awayTeamName} />
                    </div>
                  </td>
                  <td><span className="ad-table-week">Hf {m.weekNumber}</span></td>
                  <td>
                    <span className={`ad-table-status ad-status-${m.status.toLowerCase().replace(' ', '-')}`}>
                      {m.status === 'Finished' ? 'Bitti' : m.status === 'Ongoing' ? 'Canlı' : 'Bekliyor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Puan Durumu */}
        <div className="ad-standing-card">
          <div className="ad-table-header">
            <div>
              <h3 className="ad-chart-card-title">Puan Tablosu</h3>
              <p className="ad-chart-card-sub">İlk 5 takım</p>
            </div>
            <Link to="/puan-durumu" className="ad-link-btn">Tümünü Gör →</Link>
          </div>
          <div className="ad-standing-list">
            {topTeams.map((t, i) => (
              <div key={t.teamId} className="ad-standing-row">
                <span className={`ad-st-rank ad-rank-${i + 1}`}>{i + 1}</span>
                <img src={t.teamLogo} alt={t.teamName} className="ad-st-logo" />
                <div className="ad-st-info">
                  <span className="ad-st-name">{t.teamName}</span>
                  <span className="ad-st-record">{t.won}G {t.drawn}B {t.lost}M</span>
                </div>
                <div className="ad-st-pts">
                  <span className="ad-pts-num">{t.points}</span>
                  <span className="ad-pts-lbl">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === QUICK ACTIONS === */}
      <div className="ad-actions-section">
        <h3 className="ad-actions-title">Hızlı İşlemler</h3>
        <div className="ad-actions-row">
          {[
            { to: '/admin/matches',         icon: '⚽', label: 'Maç Yönetimi',      sub: 'Liste, ekle, düzenle, sil', cls: 'ad-act-blue'   },
            { to: '/admin/update-score',   icon: '🎯', label: 'Skor Güncelle',    sub: 'Maç sonucu gir',            cls: 'ad-act-green'  },
            { to: '/admin/add-event',      icon: '⚽', label: 'Olay Ekle',        sub: 'Gol, kart, değişiklik',     cls: 'ad-act-orange' },
            { to: '/admin/add-statistics', icon: '📊', label: 'İstatistik Ekle',  sub: 'Maç istatistiklerini gir',  cls: 'ad-act-purple' },
          ].map(a => (
            <Link key={a.to} to={a.to} className={`ad-act-card ${a.cls}`}>
              <div className="ad-act-icon">{a.icon}</div>
              <div className="ad-act-text">
                <h4>{a.label}</h4>
                <p>{a.sub}</p>
              </div>
              <div className="ad-act-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}