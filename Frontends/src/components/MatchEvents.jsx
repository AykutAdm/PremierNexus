import { useEffect, useState } from 'react'
import { fetchEventsByMatch } from '../api/matchEvents.js'

export function MatchEvents({ matchId }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (matchId) {
      fetchEventsByMatch(matchId).then(setEvents)
    }
  }, [matchId])

  const getEventIcon = (actionType) => {
    switch (actionType.toLowerCase()) {
      case 'goal':
        return '⚽'
      case 'yellow card':
      case 'yellow_card':
        return '🟨'
      case 'red card':
      case 'red_card':
        return '🟥'
      case 'substitution':
        return '🔄'
      case 'penalty':
        return '🥅'
      case 'own goal':
      case 'own_goal':
        return '⚽🔴'
      default:
        return '📝'
    }
  }

  const getEventClass = (actionType) => {
    switch (actionType.toLowerCase()) {
      case 'goal':
      case 'penalty':
        return 'pn-event--goal'
      case 'yellow card':
      case 'yellow_card':
        return 'pn-event--yellow'
      case 'red card':
      case 'red_card':
        return 'pn-event--red'
      case 'substitution':
        return 'pn-event--sub'
      default:
        return 'pn-event--default'
    }
  }

  const formatMinute = (event) => {
    if (event.extraMinute) {
      return `${event.minute}+${event.extraMinute}'`
    }
    return `${event.minute}'`
  }

  // Dakikaya göre sırala
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute)

  if (!matchId) {
    return (
      <div className="pn-match-events-empty">
        <p>Maç detayı görmek için bir maça tıklayın</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="pn-match-events-empty">
        <p>Bu maçta henüz olay kaydedilmemiş</p>
      </div>
    )
  }

  return (
    <div className="pn-match-events">
      <div className="pn-match-events-header">
        <h3 className="pn-match-events-title">MAÇ OLAYLARI</h3>
        <span className="pn-match-events-count">{events.length} olay</span>
      </div>

      <div className="pn-match-events-timeline">
        {sortedEvents.map((event) => (
          <div key={event.matchEventId} className={`pn-match-event ${getEventClass(event.actionType)}`}>
            <div className="pn-event-minute">
              <span className="pn-minute-badge">{formatMinute(event)}</span>
            </div>
            
            <div className="pn-event-icon">
              <span className="pn-event-emoji">{getEventIcon(event.actionType)}</span>
            </div>
            
            <div className="pn-event-content">
              <div className="pn-event-header">
                <span className="pn-event-type">{event.actionType}</span>
                <span className="pn-event-team">{event.teamName}</span>
              </div>
              
              {event.description && (
                <div className="pn-event-description">
                  {event.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}