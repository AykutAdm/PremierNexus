import { useEffect, useState } from 'react'
import { fetchMatchById } from '../api/match.js'

export function MatchDetail({ matchId }) {
  const [match, setMatch] = useState(null)

  useEffect(() => {
    if (matchId) {
      fetchMatchById(matchId).then(setMatch)
    }
  }, [matchId])

  if (!match) {
    return <div className="pn-loading">Maç bilgisi yükleniyor...</div>
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Finished':
        return <span className="pn-match-status pn-match-status--finished">✅ Bitti</span>
      case 'Ongoing':
        return <span className="pn-match-status pn-match-status--live">🔴 Canlı</span>
      case 'Not Played':
        return <span className="pn-match-status pn-match-status--upcoming">⏳ Oynanacak</span>
      default:
        return <span className="pn-match-status">{status}</span>
    }
  }

  return (
    <div className="pn-match-detail">
      <div className="pn-match-detail-header">
        <div className="pn-match-detail-meta">
          <span className="pn-match-week">Hafta {match.weekNumber}</span>
          <span className="pn-match-season">{match.seasonName}</span>
          {getStatusBadge(match.status)}
        </div>
      </div>

      <div className="pn-match-detail-main">
        <div className="pn-match-detail-teams">
          <div className="pn-match-detail-team">
            <img src={match.homeTeamLogo} alt={match.homeTeamName} className="pn-team-logo-large" />
            <h2 className="pn-team-name-large">{match.homeTeamName}</h2>
            <span className="pn-team-type">Ev Sahibi</span>
          </div>

          <div className="pn-match-detail-score">
            {match.status === 'Not Played' ? (
              <div className="pn-score-upcoming">
                <span className="pn-vs">vs</span>
                <div className="pn-match-time">
                  {new Date(match.matchDate).toLocaleString('tr-TR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ) : (
              <div className="pn-score-finished">
                <div className="pn-final-score">
                  <span className="pn-home-score">{match.homeScore || 0}</span>
                  <span className="pn-score-divider">—</span>
                  <span className="pn-away-score">{match.awayScore || 0}</span>
                </div>
                {(match.homeScoreHT != null && match.awayScoreHT != null) && (
                  <div className="pn-halftime-score">
                    Devre: {match.homeScoreHT} — {match.awayScoreHT}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pn-match-detail-team">
            <img src={match.awayTeamLogo} alt={match.awayTeamName} className="pn-team-logo-large" />
            <h2 className="pn-team-name-large">{match.awayTeamName}</h2>
            <span className="pn-team-type">Deplasman</span>
          </div>
        </div>

        <div className="pn-match-detail-info">
          <div className="pn-match-info-grid">
            <div className="pn-match-info-item">
              <span className="pn-match-info-label">Stadyum:</span>
              <span className="pn-match-info-value">🏟️ {match.stadiumName}</span>
            </div>
            
            <div className="pn-match-info-item">
              <span className="pn-match-info-label">Tarih:</span>
              <span className="pn-match-info-value">
                📅 {new Date(match.matchDate).toLocaleDateString('tr-TR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            
            <div className="pn-match-info-item">
              <span className="pn-match-info-label">Saat:</span>
              <span className="pn-match-info-value">
                🕐 {new Date(match.matchDate).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {match.referee && (
              <div className="pn-match-info-item">
                <span className="pn-match-info-label">Hakem:</span>
                <span className="pn-match-info-value">👨‍⚖️ {match.referee}</span>
              </div>
            )}

            {match.attendance && (
              <div className="pn-match-info-item">
                <span className="pn-match-info-label">Seyirci:</span>
                <span className="pn-match-info-value">
                  👥 {match.attendance.toLocaleString()} kişi
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}