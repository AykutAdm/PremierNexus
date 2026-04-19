import { useEffect, useState } from 'react'
import { fetchStatisticsByMatch } from '../api/matchStatistics.js'

export function MatchStatistics({ matchId, homeTeamName, awayTeamName }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (matchId) {
      setLoading(true)
      fetchStatisticsByMatch(matchId)
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setLoading(false))
    }
  }, [matchId])

  if (loading) {
    return (
      <div className="pn-match-stats">
        <div className="pn-match-stats-header">
          <h3 className="pn-match-stats-title">İSTATİSTİKLER</h3>
        </div>
        <div className="pn-stats-loading">Yükleniyor...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="pn-match-stats">
        <div className="pn-match-stats-header">
          <h3 className="pn-match-stats-title">İSTATİSTİKLER</h3>
        </div>
        <div className="pn-stats-empty">Bu maça ait istatistik bulunamadı</div>
      </div>
    )
  }

  const StatItem = ({ label, homeValue, awayValue, unit = '', showBar = true }) => {
    const homeNum = parseInt(homeValue) || 0
    const awayNum = parseInt(awayValue) || 0
    const total = homeNum + awayNum
    const homePercentage = total > 0 ? (homeNum / total) * 100 : 50
    const awayPercentage = total > 0 ? (awayNum / total) * 100 : 50

    return (
      <div className="pn-stat-item">
        <div className="pn-stat-values">
          <span className="pn-stat-home">{homeValue || 0}{unit}</span>
          <span className="pn-stat-label">{label}</span>
          <span className="pn-stat-away">{awayValue || 0}{unit}</span>
        </div>
        {showBar && (
          <div className="pn-stat-bar">
            <div 
              className="pn-stat-bar-home" 
              style={{ width: `${homePercentage}%` }}
            ></div>
            <div 
              className="pn-stat-bar-away" 
              style={{ width: `${awayPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="pn-match-stats">
      <div className="pn-match-stats-header">
        <h3 className="pn-match-stats-title">İSTATİSTİKLER</h3>
        <div className="pn-match-stats-teams">
          <span className="pn-stats-home-team">{homeTeamName}</span>
          <span className="pn-stats-away-team">{awayTeamName}</span>
        </div>
      </div>

      <div className="pn-match-stats-grid">
        {/* Possession */}
        <StatItem 
          label="Topa Sahip Olma"
          homeValue={stats.homePossessionPct}
          awayValue={stats.awayPossessionPct}
          unit="%"
        />

        {/* Shots */}
        <StatItem 
          label="Şutlar"
          homeValue={stats.homeShots}
          awayValue={stats.awayShots}
        />

        {/* Shots on Target */}
        <StatItem 
          label="İsabetli Şutlar"
          homeValue={stats.homeShotsOnTarget}
          awayValue={stats.awayShotsOnTarget}
        />

        {/* Passes */}
        <StatItem 
          label="Paslar"
          homeValue={stats.homePasses}
          awayValue={stats.awayPasses}
        />

        {/* Pass Accuracy */}
        <StatItem 
          label="Pas Başarısı"
          homeValue={stats.homePassAccuracyPct}
          awayValue={stats.awayPassAccuracyPct}
          unit="%"
        />

        {/* Corners */}
        <StatItem 
          label="Korner"
          homeValue={stats.homeCorners}
          awayValue={stats.awayCorners}
        />

        {/* Fouls */}
        <StatItem 
          label="Faul"
          homeValue={stats.homeFouls}
          awayValue={stats.awayFouls}
        />

        {/* Offsides */}
        <StatItem 
          label="Ofsayt"
          homeValue={stats.homeOffsides}
          awayValue={stats.awayOffsides}
        />

        {/* Cards */}
        <StatItem 
          label="Sarı Kartlar"
          homeValue={stats.homeYellowCards}
          awayValue={stats.awayYellowCards}
        />

        <StatItem 
          label="Kırmızı Kartlar"
          homeValue={stats.homeRedCards}
          awayValue={stats.awayRedCards}
        />
      </div>
    </div>
  )
}