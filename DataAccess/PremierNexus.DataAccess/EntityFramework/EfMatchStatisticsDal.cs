using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfMatchStatisticsDal : GenericRepository<MatchStatistics>, IMatchStatisticsDal
{
    public EfMatchStatisticsDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<MatchStatistics?> GetByMatchIdAsync(int matchId)
    {
        return await _context.MatchStatistics
            .FirstOrDefaultAsync(ms => ms.MatchId == matchId);
    }

    public async Task<MatchStatistics?> GetByMatchIdWithNavigationsAsync(int matchId)
    {
        return await _context.MatchStatistics
            .Include(ms => ms.Match)
                .ThenInclude(m => m.HomeTeam)
            .Include(ms => ms.Match)
                .ThenInclude(m => m.AwayTeam)
            .Include(ms => ms.Match)
                .ThenInclude(m => m.Stadium)
            .FirstOrDefaultAsync(ms => ms.MatchId == matchId);
    }

    public async Task<List<MatchStatistics>> GetListWithNavigationsAsync()
    {
        return await _context.MatchStatistics
            .Include(ms => ms.Match)
                .ThenInclude(m => m.HomeTeam)
            .Include(ms => ms.Match)
                .ThenInclude(m => m.AwayTeam)
            .OrderByDescending(ms => ms.Match.MatchDate)
            .ToListAsync();
    }
}