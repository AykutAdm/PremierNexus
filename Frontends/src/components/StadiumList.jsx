import { useEffect, useState } from 'react'
import { fetchStadiums } from '../api/stadiums.js'

export function StadiumList() {
  const [stadiums, setStadiums] = useState([])

  useEffect(() => {
    fetchStadiums().then(setStadiums)
  }, [])

  return (
    <div className="pn-stadiums-grid">
      {stadiums.map((stadium) => (
        <article key={stadium.stadiumId} className="pn-stadium-card">
          <div className="pn-stadium-card-body">
            <h3 className="pn-stadium-name">{stadium.name}</h3>
            <div className="pn-stadium-details">
              <span className="pn-stadium-location">{stadium.location}</span>
              <span className="pn-stadium-capacity">Kapasite: {stadium.capacity?.toLocaleString()}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}