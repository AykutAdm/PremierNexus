import { useState } from 'react'
import { MatchList } from '../components/MatchList.jsx'
import { MatchesByWeek } from '../components/MatchesByWeek.jsx'

export function FixturesPage() {
  const [viewMode, setViewMode] = useState('all') // 'all' | 'weekly'

  return (
    <>
      <div className="pn-page-head">
        <h1>Fikstür</h1>
        <p>
          Maçlar hafta, status, stadyum ve hakem bilgileri ile beraber
        </p>
        
        <div className="pn-view-tabs">
          <button 
            className={`pn-tab ${viewMode === 'all' ? 'pn-tab--active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            Tüm Maçlar
          </button>
          <button 
            className={`pn-tab ${viewMode === 'weekly' ? 'pn-tab--active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Haftalık Görünüm
          </button>
        </div>
      </div>
      
      {viewMode === 'all' ? <MatchList /> : <MatchesByWeek />}
    </>
  )
}
