import { useEffect, useState } from 'react'
import { fetchCurrentStandings } from '../api/standings.js'

export function StandingTable() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    // Premier League ID = 1 (sabit)
    fetchCurrentStandings(1).then(setRows)
  }, [])

  const sorted = [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return b.goalDifference - a.goalDifference
  })

  return (
    <div className="pn-standings-wrap">
      <div className="pn-table-scroll">
        <table className="pn-table pn-table--standings">
          <thead>
            <tr>
              <th className="pn-th-rank">#</th>
              <th>Takım</th>
              <th className="pn-num">O</th>
              <th className="pn-num">G</th>
              <th className="pn-num">B</th>
              <th className="pn-num">M</th>
              <th className="pn-num">A</th>
              <th className="pn-num">Y</th>
              <th className="pn-num">Av</th>
              <th className="pn-num pn-th-pts">P</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, index) => (
              <tr
                key={item.teamId}
                className={index < 3 ? 'pn-standings-row pn-standings-row--top' : 'pn-standings-row'}
              >
                <td className="pn-col-rank">{index + 1}</td>
                <td className="pn-col-team pn-col-team--with-logo">
                  <span className="pn-standings-logo">
                    <img src={item.teamLogo} alt="" loading="lazy" />
                  </span>
                  <span className="pn-standings-team-name">{item.teamName}</span>
                </td>
                <td className="pn-num">{item.played}</td>
                <td className="pn-num">{item.won}</td>
                <td className="pn-num">{item.drawn}</td>
                <td className="pn-num">{item.lost}</td>
                <td className="pn-num">{item.goalsFor}</td>
                <td className="pn-num">{item.goalsAgainst}</td>
                <td className="pn-num">{item.goalDifference}</td>
                <td className="pn-num pn-pts">{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
