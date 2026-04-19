import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCurrentStandings } from '../api/standings.js'
import { fetchMatches } from '../api/match.js'
import { fetchTeams } from '../api/teams.js'

const IMG = {
  hero: 'https://i.pinimg.com/1200x/54/46/79/544679398643399bf4e497bc5f4b13f7.jpg',
  premierLeague: 'https://i.pinimg.com/1200x/a8/06/a8/a806a8dcd797c67eb9c5e42ee0b8dae3.jpg',
  stadium: 'https://i.pinimg.com/1200x/1e/c6/65/1ec6653e14d1f5f78df19ef1914e3ccf.jpg',
  trophy: 'https://i.pinimg.com/1200x/d6/4d/68/d64d68f62a7131b61679f22e70a21c9f.jpg',
  matchday: 'https://i.pinimg.com/1200x/66/11/02/66110204eae78c21ab58184a9449dc85.jpg'
}

export function HomePage() {
  const [standings, setStandings] = useState([])
  const [matches, setMatches] = useState([])
  const [teams, setTeams] = useState([])
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0
  })

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        const [standingsData, matchesData, teamsData] = await Promise.all([
          fetchCurrentStandings(1), // Premier League ID = 1
          fetchMatches(),
          fetchTeams()
        ])

        setStandings(standingsData.slice(0, 5)) // Top 5 teams
        setMatches(matchesData.slice(0, 6)) // Recent 6 matches
        setTeams(teamsData)

        // Calculate stats
        const completedMatches = matchesData.filter(m => m.status === 'Finished').length
        const upcomingMatches = matchesData.filter(m => m.status === 'Not Played').length

        setStats({
          totalTeams: teamsData.length,
          totalMatches: matchesData.length,
          completedMatches,
          upcomingMatches
        })
      } catch (error) {
        console.error('Dashboard data yüklenirken hata:', error)
      }
    }

    loadDashboardData()
  }, [])

  const formatMatchDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMatchResult = (match) => {
    if (match.status === 'Not Played') return 'vs'
    return `${match.homeScore || 0} - ${match.awayScore || 0}`
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pn-hero">
        <div className="pn-hero-bg">
          <img src={IMG.hero} alt="Premier League" />
          <div className="pn-hero-overlay"></div>
        </div>
        <div className="pn-hero-content">
          <div className="pn-hero-text">
            <h1>Premier Nexus</h1>
            <p>İngiltere Premier Ligi'nin kapsamlı yönetim sistemi</p>
            <div className="pn-hero-features">
              <span className="pn-feature">⚽ Canlı Maç Sonuçları</span>
              <span className="pn-feature">📊 Detaylı İstatistikler</span>
              <span className="pn-feature">🏆 Puan Durumu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="pn-dashboard-stats">
        <div className="pn-stat-card">
          <div className="pn-stat-icon">🏟️</div>
          <div className="pn-stat-content">
            <h3>{stats.totalTeams}</h3>
            <p>Toplam Takım</p>
          </div>
        </div>
        
        <div className="pn-stat-card">
          <div className="pn-stat-icon">⚽</div>
          <div className="pn-stat-content">
            <h3>{stats.totalMatches}</h3>
            <p>Toplam Maç</p>
          </div>
        </div>
        
        <div className="pn-stat-card">
          <div className="pn-stat-icon">✅</div>
          <div className="pn-stat-content">
            <h3>{stats.completedMatches}</h3>
            <p>Tamamlanan</p>
          </div>
        </div>
        
        <div className="pn-stat-card">
          <div className="pn-stat-icon">⏰</div>
          <div className="pn-stat-content">
            <h3>{stats.upcomingMatches}</h3>
            <p>Yaklaşan</p>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="pn-dashboard">
        {/* Top 5 Standings */}
        <div className="pn-dashboard-card">
          <div className="pn-dashboard-header">
            <h2>🏆 Puan Durumu (İlk 5)</h2>
            <Link to="/puan-durumu" className="pn-view-all">Tümünü Gör →</Link>
          </div>
          <div className="pn-mini-standings">
            {standings.map((team, index) => (
              <div key={team.teamId} className="pn-mini-standing-item">
                <span className="pn-position">{index + 1}</span>
                <img src={team.teamLogo} alt={team.teamName} className="pn-mini-logo" />
                <span className="pn-team-name">{team.teamName}</span>
                <span className="pn-points">{team.points}p</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="pn-dashboard-card">
          <div className="pn-dashboard-header">
            <h2>⚽ Son Maçlar</h2>
            <Link to="/fikstur" className="pn-view-all">Tümünü Gör →</Link>
          </div>
          <div className="pn-mini-matches">
            {matches.map((match) => (
              <div key={match.matchId} className="pn-mini-match">
                <div className="pn-mini-match-teams">
                  <div className="pn-mini-team">
                    <img src={match.homeTeamLogo} alt={match.homeTeamName} />
                    <span>{match.homeTeamName}</span>
                  </div>
                  <div className="pn-mini-score">
                    {getMatchResult(match)}
                  </div>
                  <div className="pn-mini-team">
                    <span>{match.awayTeamName}</span>
                    <img src={match.awayTeamLogo} alt={match.awayTeamName} />
                  </div>
                </div>
                <div className="pn-mini-match-info">
                  <span className="pn-mini-date">{formatMatchDate(match.matchDate)}</span>
                  <span className={`pn-mini-status pn-status--${match.status.toLowerCase().replace(' ', '-')}`}>
                    {match.status === 'Finished' ? '✅ Bitti' : 
                     match.status === 'Ongoing' ? '🔴 Canlı' : '⏰ Bekliyor'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Gallery */}
      <section className="pn-features">
        <div className="pn-feature-card">
          <img src={IMG.premierLeague} alt="Premier League" />
          <div className="pn-feature-content">
            <h3>🏆 Premier League</h3>
            <p>Dünyanın en prestijli futbol ligi</p>
          </div>
        </div>
        
        <div className="pn-feature-card">
          <img src={IMG.stadium} alt="Stadium" />
          <div className="pn-feature-content">
            <h3>🏟️ Stadyumlar</h3>
            <p>20 takımın efsanevi sahaları</p>
          </div>
        </div>
        
        <div className="pn-feature-card">
          <img src={IMG.trophy} alt="Trophy" />
          <div className="pn-feature-content">
            <h3>🥇 Şampiyonluk</h3>
            <p>Her sezon için heyecanlı yarış</p>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="pn-quick-nav">
        <h2>🧭 Hızlı Erişim</h2>
        <div className="pn-nav-grid">
          <Link to="/takimlar" className="pn-nav-card pn-nav--teams">
            <div className="pn-nav-icon">🏟️</div>
            <h3>Takımlar</h3>
            <p>Tüm Premier League takımları, stadyumlar ve detaylar</p>
          </Link>
          
          <Link to="/puan-durumu" className="pn-nav-card pn-nav--standings">
            <div className="pn-nav-icon">🏆</div>
            <h3>Puan Durumu</h3>
            <p>Güncel lig tablosu ve takım sıralamaları</p>
          </Link>
          
          <Link to="/fikstur" className="pn-nav-card pn-nav--fixtures">
            <div className="pn-nav-icon">⚽</div>
            <h3>Fikstür</h3>
            <p>Maç programı, sonuçlar ve detaylı analiz</p>
          </Link>

          <Link to="/admin" className="pn-nav-card pn-nav--admin">
            <div className="pn-nav-icon">⚡</div>
            <h3>Admin Panel</h3>
            <p>Yönetim sistemi, veri ekleme ve güncelleme</p>
          </Link>
        </div>
      </section>
    </>
  )
}