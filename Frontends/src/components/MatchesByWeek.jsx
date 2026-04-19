import { useEffect, useState } from 'react'
import { fetchMatchesByWeek } from '../api/match.js'
import { MatchDetailWithEvents } from './MatchDetailWithEvents.jsx'

export function MatchesByWeek() {
  const [matches, setMatches] = useState([])
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedMatchId, setSelectedMatchId] = useState(null)

  useEffect(() => {
    fetchMatchesByWeek(selectedWeek).then(setMatches)
  }, [selectedWeek])

  const weekOptions = Array.from({ length: 38 }, (_, i) => i + 1) // Premier League 38 hafta

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

  return (
    <div className="pn-matches-by-week">
      <div className="pn-week-filter">
        <label htmlFor="week-select">Hafta Seçin:</label>
        <select
          id="week-select"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="pn-select"
        >
          {weekOptions.map((week) => (
            <option key={week} value={week}>
              {week}. Hafta
            </option>
          ))}
        </select>
      </div>

      <section className="pn-matches-stack">
        <h3 className="pn-round-title">{selectedWeek}. Hafta Maçları</h3>
        {matches.length === 0 ? (
          <p className="pn-no-matches">Bu hafta henüz maç yok.</p>
        ) : (
          matches.map((match) => (
            <article 
              key={match.matchId} 
              className="pn-match pn-match--rich pn-match--clickable"
              onClick={() => setSelectedMatchId(match.matchId)}
            >
              <div className="pn-match-header">
                {getStatusBadge(match.status)}
              </div>
              
              <div className="pn-match-line">
                <div className="pn-match-col pn-match-col--home">
                  <div className="pn-match-crest">
                    <img src={match.homeTeamLogo} alt="" />
                  </div>
                  <span className="pn-match-team-name">{match.homeTeamName}</span>
                </div>
                
                <div className="pn-match-col pn-match-col--center">
                  <span className="pn-match-score">
                    {formatScore(match)}
                  </span>
                  <span className="pn-match-date">
                    {new Date(match.matchDate).toLocaleString('tr-TR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="pn-match-venue">🏟️ {match.stadiumName}</span>
                </div>
                
                <div className="pn-match-col pn-match-col--away">
                  <span className="pn-match-team-name">{match.awayTeamName}</span>
                  <div className="pn-match-crest">
                    <img src={match.awayTeamLogo} alt="" />
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Match Detail Modal */}
      {selectedMatchId && (
        <MatchDetailWithEvents 
          matchId={selectedMatchId} 
          onClose={() => setSelectedMatchId(null)} 
        />
      )}
    </div>
  )
}