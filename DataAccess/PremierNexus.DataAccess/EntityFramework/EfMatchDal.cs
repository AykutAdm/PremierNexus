using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfMatchDal : GenericRepository<Match>, IMatchDal
{
    public EfMatchDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<Match>> GetListWithNavigationsAsync()
    {
        return await _context.Matches
            .Include(m => m.Season)
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .OrderBy(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<Match?> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.Matches
            .Include(m => m.Season)
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .Include(m => m.MatchStatistics)
            .Include(m => m.MatchEvents)
                .ThenInclude(me => me.Team)
            .FirstOrDefaultAsync(m => m.MatchId == id);
    }

    public async Task<List<Match>> MatchListWithTeamLogoAsync()
    {
        return await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .OrderBy(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<List<Match>> GetMatchesBySeasonAsync(int seasonId)
    {
        return await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .Where(m => m.SeasonId == seasonId)
            .OrderBy(m => m.WeekNumber)
            .ThenBy(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<List<Match>> GetMatchesByWeekAsync(int seasonId, short weekNumber)
    {
        return await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .Where(m => m.SeasonId == seasonId && m.WeekNumber == weekNumber)
            .OrderBy(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<List<Match>> GetMatchesByStatusAsync(string status)
    {
        return await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .Where(m => m.Status == status)
            .OrderBy(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<List<Match>> GetFinishedMatchesByTeamAsync(int teamId)
    {
        return await _context.Matches
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Where(m => (m.HomeTeamId == teamId || m.AwayTeamId == teamId)
                     && m.Status == "Finished")
            .OrderByDescending(m => m.MatchDate)
            .ToListAsync();
    }

    public async Task<List<Match>> GetMatchesWithFullNavigationAsync()
    {
        return await _context.Matches
            .Include(m => m.Season)
            .Include(m => m.HomeTeam)
            .Include(m => m.AwayTeam)
            .Include(m => m.Stadium)
            .OrderBy(m => m.MatchDate)
            .ToListAsync();
    }
}