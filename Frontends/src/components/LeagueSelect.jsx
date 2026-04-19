import { useEffect, useState } from 'react'
import { fetchLeagues } from '../api/leagues.js'

export function LeagueSelect({ onLeagueChange, selectedLeagueId = 1 }) {
  const [leagues, setLeagues] = useState([])

  useEffect(() => {
    fetchLeagues().then(setLeagues)
  }, [])

  return (
    <div className="pn-league-select">
      <label htmlFor="league-dropdown">Lig Seçin:</label>
      <select 
        id="league-dropdown"
        value={selectedLeagueId} 
        onChange={(e) => onLeagueChange(Number(e.target.value))}
        className="pn-select"
      >
        {leagues.map((league) => (
          <option key={league.leagueId} value={league.leagueId}>
            {league.name} ({league.country})
          </option>
        ))}
      </select>
    </div>
  )
}