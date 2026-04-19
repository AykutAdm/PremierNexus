import { useEffect, useState } from 'react'
import { fetchMatches } from '../api/match.js'
import { MatchEvents } from './MatchEvents.jsx'
import { MatchStatistics } from './MatchStatistics.jsx'

export function MatchDetailWithEvents({ matchId, onClose }) {
  const [match, setMatch] = useState(null)
  const [activeTab, setActiveTab] = useState('events') // 'events' | 'statistics'

  useEffect(() => {
    if (matchId) {
      // Tüm maçları çek ve ID ile filtrele (navigation properties dahil)
      fetchMatches().then(matches => {
        const selectedMatch = matches.find(m => m.matchId === matchId)
        setMatch(selectedMatch)
      })
    }
  }, [matchId])

  if (!match) {
    return (
      <div className="pn-match-detail-modal">
        <div className="pn-match-detail-overlay" onClick={onClose}>
          <div className="pn-match-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="pn-loading">Maç detayları yükleniyor...</div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Finished':
        return <span className="pn-match-status pn-match-status--finished">MAÇ BİTTİ</span>
      case 'Ongoing':
        return <span className="pn-match-status pn-match-status--live">CANLI</span>
      case 'Not Played':
        return <span className="pn-match-status pn-match-status--upcoming">OYNANACAK</span>
      default:
        return <span className="pn-match-status">{status}</span>
    }
  }

  return (
    <div className="pn-match-detail-modal">
      <div className="pn-match-detail-overlay" onClick={onClose}>
        <div className="pn-match-detail-content" onClick={(e) => e.stopPropagation()}>
          {/* Header dengan close button */}
          <div className="pn-match-detail-modal-header">
            <div className="pn-match-league-info">
              <span className="pn-match-league">🏆 PREMIER LEAGUE</span>
              <span className="pn-match-week">HAFTA {match.weekNumber}</span>
            </div>
            <button className="pn-modal-close" onClick={onClose}>✕</button>
          </div>

          {/* Match Score Section - GoalZone Style */}
          <div className="pn-match-score-section">
            <div className="pn-match-teams-score">
              {/* Home Team */}
              <div className="pn-team-score">
                <div className="pn-team-info">
                  <img src={match.homeTeamLogo} alt={match.homeTeamName} className="pn-team-logo-big" />
                  <div className="pn-team-details">
                    <h2 className="pn-team-name-big">{match.homeTeamName}</h2>
                    <span className="pn-team-type">EV SAHİBİ</span>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="pn-score-display">
                {match.status === 'Not Played' ? (
                  <div className="pn-match-upcoming">
                    <div className="pn-match-time">
                      {new Date(match.matchDate).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                    <div className="pn-match-hour">
                      {new Date(match.matchDate).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="pn-final-score-big">
                    <span className="pn-home-score-big">{match.homeScore || 0}</span>
                    <span className="pn-score-separator">-</span>
                    <span className="pn-away-score-big">{match.awayScore || 0}</span>
                    {(match.homeScoreHT != null && match.awayScoreHT != null) && (
                      <div className="pn-halftime-score-small">
                        ({match.homeScoreHT}-{match.awayScoreHT})
                      </div>
                    )}
                  </div>
                )}
                {getStatusBadge(match.status)}
              </div>

              {/* Away Team */}

              <div className="pn-team-score">
                <div className="pn-team-info">
                  <img src={match.awayTeamLogo} alt={match.awayTeamName} className="pn-team-logo-big" />
                  <div className="pn-team-details">
                    <h2 className="pn-team-name-big">{match.awayTeamName}</h2>
                    <span className="pn-team-type">DEPLASMAN</span>
                  </div>
                </div>
              </div>
             
            </div>

            {/* Match Info */}
            <div className="pn-match-info-bar">
              <div className="pn-match-info-item">
                <span className="pn-info-icon">📅</span>
                <span>{new Date(match.matchDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}</span>
              </div>
              <div className="pn-match-info-item">
                <span className="pn-info-icon">🏟️</span>
                <span>{match.stadiumName}</span>
              </div>
              {match.referee && (
                <div className="pn-match-info-item">
                  <span className="pn-info-icon">👨‍⚖️</span>
                  <span>{match.referee}</span>
                </div>
              )}
              {match.attendance && (
                <div className="pn-match-info-item">
                  <span className="pn-info-icon">👥</span>
                  <span>{match.attendance.toLocaleString()} seyirci</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="pn-match-tabs">
            <button 
              className={`pn-tab ${activeTab === 'events' ? 'pn-tab--active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <span className="pn-tab-icon">⚽</span>
              <span>MAÇ OLAYLARI</span>
            </button>
            <button 
              className={`pn-tab ${activeTab === 'statistics' ? 'pn-tab--active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              <span className="pn-tab-icon">📊</span>
              <span>İSTATİSTİKLER</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pn-match-events-section">
            {activeTab === 'events' && <MatchEvents matchId={matchId} />}
            {activeTab === 'statistics' && (
              <MatchStatistics 
                matchId={matchId} 
                homeTeamName={match.homeTeamName}
                awayTeamName={match.awayTeamName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}