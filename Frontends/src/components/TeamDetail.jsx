import { useEffect, useState } from 'react'
import { fetchTeamById } from '../api/teams.js'

export function TeamDetail({ teamId }) {
  const [team, setTeam] = useState(null)

  useEffect(() => {
    if (teamId) {
      fetchTeamById(teamId).then(setTeam)
    }
  }, [teamId])

  if (!team) {
    return <div className="pn-loading">Team bilgisi yükleniyor...</div>
  }

  return (
    <div className="pn-team-detail">
      <div className="pn-team-detail-header">
        <div className="pn-team-detail-logo">
          <img src={team.logoUrl} alt={team.name} />
        </div>
        <div className="pn-team-detail-info">
          <h1 className="pn-team-detail-name">{team.name}</h1>
          <p className="pn-team-detail-short">{team.shortName}</p>
        </div>
      </div>

      <div className="pn-team-detail-body">
        <div className="pn-team-detail-grid">
          <div className="pn-team-detail-item">
            <span className="pn-team-detail-label">Şehir:</span>
            <span className="pn-team-detail-value">{team.city}</span>
          </div>
          
          <div className="pn-team-detail-item">
            <span className="pn-team-detail-label">Kuruluş:</span>
            <span className="pn-team-detail-value">{team.founded}</span>
          </div>
          
          <div className="pn-team-detail-item">
            <span className="pn-team-detail-label">Lig:</span>
            <span className="pn-team-detail-value">{team.leagueName}</span>
          </div>
          
          <div className="pn-team-detail-item">
            <span className="pn-team-detail-label">Ana Saha:</span>
            <span className="pn-team-detail-value">
              🏟️ {team.homeStadiumName || 'Stadyum bilgisi yok'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}