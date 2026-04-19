import { useEffect, useState } from 'react'
import { fetchMatches } from '../api/match.js'
import { MatchDetailWithEvents } from './MatchDetailWithEvents.jsx'

export function MatchList() {
  const [matches, setMatches] = useState([])
  const [selectedMatchId, setSelectedMatchId] = useState(null)

  useEffect(() => {
    fetchMatches().then(setMatches)
  }, [])

  const handleMatchClick = (matchId) => {
    setSelectedMatchId(matchId)
  }

  const handleCloseModal = () => {
    setSelectedMatchId(null)
  }

  const sorted = [...matches].sort(
    (a, b) => new Date(a.matchDate) - new Date(b.matchDate),
  )

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

  const formatScore = (match) => {
    if (match.status === 'Not Played') {
      return 'vs'
    }
    return `${match.homeScore || 0} — ${match.awayScore || 0}`
  }

  const formatHalfTimeScore = (match) => {
    if (match.homeScoreHT != null && match.awayScoreHT != null) {
      return `(${match.homeScoreHT} — ${match.awayScoreHT})`
    }
    return ''
  }

  return (
    <section className="pn-matches-stack">
      <h2 className="pn-round-title">Maçlar</h2>
      {sorted.map((item) => (
        <article 
          key={item.matchId} 
          className="pn-match pn-match--rich pn-match--clickable"
          onClick={() => handleMatchClick(item.matchId)}
        >
          <div className="pn-match-header">
            <span className="pn-match-week">Hafta {item.weekNumber}</span>
            <span className="pn-match-season">{item.seasonName}</span>
            {getStatusBadge(item.status)}
          </div>
          
          <div className="pn-match-line">
            <div className="pn-match-col pn-match-col--home">
              <div className="pn-match-crest">
                <img src={item.homeTeamLogo} alt="" />
              </div>
              <span className="pn-match-team-name">{item.homeTeamName}</span>
            </div>
            
            <div className="pn-match-col pn-match-col--center">
              <span className="pn-match-score">
                {formatScore(item)}
              </span>
              <span className="pn-match-halftime">
                {formatHalfTimeScore(item)}
              </span>
              <span className="pn-match-date">
                {new Date(item.matchDate).toLocaleString('tr-TR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="pn-match-venue">🏟️ {item.stadiumName}</span>
            </div>
            
            <div className="pn-match-col pn-match-col--away">
              <span className="pn-match-team-name">{item.awayTeamName}</span>
              <div className="pn-match-crest">
                <img src={item.awayTeamLogo} alt="" />
              </div>
            </div>
          </div>

          {(item.referee || item.attendance) && (
            <div className="pn-match-footer">
              {item.referee && <span className="pn-match-referee">👨‍⚖️ {item.referee}</span>}
              {item.attendance && (
                <span className="pn-match-attendance">
                  👥 {item.attendance.toLocaleString()} seyirci
                </span>
              )}
            </div>
          )}
        </article>
      ))}

      {/* Match Detail Modal */}
      {selectedMatchId && (
        <MatchDetailWithEvents 
          matchId={selectedMatchId} 
          onClose={handleCloseModal} 
        />
      )}
    </section>
  )
}
