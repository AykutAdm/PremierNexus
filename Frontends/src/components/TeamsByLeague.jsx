import { useEffect, useState } from 'react'
import { fetchTeamsByLeague } from '../api/teams.js'
import { LeagueSelect } from './LeagueSelect.jsx'

export function TeamsByLeague() {
  const [teams, setTeams] = useState([])
  const [selectedLeagueId, setSelectedLeagueId] = useState(1)

  useEffect(() => {
    fetchTeamsByLeague(selectedLeagueId).then(setTeams)
  }, [selectedLeagueId])

  const handleLeagueChange = (leagueId) => {
    setSelectedLeagueId(leagueId)
  }

  return (
    <div className="pn-teams-by-league">
      <div className="pn-teams-filter">
        <LeagueSelect 
          onLeagueChange={handleLeagueChange} 
          selectedLeagueId={selectedLeagueId} 
        />
      </div>

      <div className="pn-teams-grid">
        {teams.map((team) => (
          <article key={team.teamId} className="pn-team-card">
            <div className="pn-team-media">
              <div className="pn-team-crest">
                <img src={team.logoUrl} alt="" loading="lazy" />
              </div>
            </div>
            <div className="pn-team-card-body">
              <h3 className="pn-team-name">{team.name}</h3>
              <div className="pn-team-meta-top">
                <span className="pn-team-code">{team.shortName}</span>
                <span className="pn-team-city">{team.city}</span>
              </div>
              <div className="pn-team-foot">
                <span className="pn-team-ground">🏟️ {team.homeStadiumName || 'Stadyum bilgisi yok'}</span>
                <span className="pn-team-founded">📅 Kuruluş {team.founded}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}