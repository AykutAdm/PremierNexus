using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfMatchEventDal : GenericRepository<MatchEvent>, IMatchEventDal
{
    public EfMatchEventDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<MatchEvent>> GetListWithNavigationsAsync()
    {
        return await _context.MatchEvents
            .Include(x => x.Match)
                .ThenInclude(x => x.HomeTeam)
            .Include(x => x.Match)
                .ThenInclude(x => x.AwayTeam)
            .Include(x => x.Team)
            .OrderBy(x => x.Match.MatchDate)
            .ThenBy(x => x.Minute)
            .ToListAsync();
    }

    public async Task<MatchEvent?> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.MatchEvents
            .Include(x => x.Match)
                .ThenInclude(m => m.HomeTeam)
            .Include(x => x.Match)
                .ThenInclude(m => m.AwayTeam)
            .Include(x => x.Team)
            .FirstOrDefaultAsync(x => x.MatchEventId == id);
    }

    public async Task<List<MatchEvent>> GetEventsByMatchAsync(int matchId)
    {
        return await _context.MatchEvents
            .Include(x => x.Team)
            .Where(x => x.MatchId == matchId)
            .OrderBy(x => x.Minute)
            .ThenBy(x => x.ExtraMinute)
            .ToListAsync();
    }

    public async Task<List<MatchEvent>> GetEventsByTeamAsync(int teamId)
    {
        return await _context.MatchEvents
            .Include(x => x.Match)
                .ThenInclude(x => x.HomeTeam)
            .Include(x => x.Match)
                .ThenInclude(x => x.AwayTeam)
            .Where(x => x.TeamId == teamId)
            .OrderByDescending(x => x.Match.MatchDate)
            .ThenBy(x => x.Minute)
            .ToListAsync();
    }

    public async Task<List<MatchEvent>> GetEventsByActionTypeAsync(string actionType)
    {
        return await _context.MatchEvents
            .Include(x => x.Match)
                .ThenInclude(x => x.HomeTeam)
            .Include(x => x.Match)
                .ThenInclude(x => x.AwayTeam)
            .Include(x => x.Team)
            .Where(x => x.ActionType == actionType)
            .OrderByDescending(x => x.Match.MatchDate)
            .ThenBy(x => x.Minute)
            .ToListAsync();
    }
}