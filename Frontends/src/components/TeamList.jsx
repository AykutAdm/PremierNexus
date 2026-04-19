import { useEffect, useState } from 'react'
import { fetchTeams } from '../api/teams.js'

export function TeamList() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    fetchTeams().then(setTeams)
  }, [])

  return (
    <div className="pn-teams-grid">
      {teams.map((item) => (
        <article key={item.teamId} className="pn-team-card">
          <div className="pn-team-media">
            <div className="pn-team-crest">
              <img src={item.logoUrl} alt="" loading="lazy" />
            </div>
          </div>
          <div className="pn-team-card-body">
            <h2 className="pn-team-name">{item.name}</h2>
            <div className="pn-team-meta-top">
              <span className="pn-team-code">{item.shortName}</span>
              <span className="pn-team-city">{item.city}</span>
            </div>
            <div className="pn-team-foot">
              <span className="pn-team-ground">🏟️ {item.homeStadiumName || 'Stadyum bilgisi yok'}</span>
              <span className="pn-team-founded">📅 Kuruluş {item.founded}</span>
            </div>
            <div className="pn-team-league">
              <span className="pn-team-league-name">{item.leagueName}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
