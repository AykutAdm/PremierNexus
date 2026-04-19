using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfSeasonDal : GenericRepository<Season>, ISeasonDal
{
    public EfSeasonDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<Season>> GetListWithNavigationsAsync()
    {
        return await _context.Seasons
            .Include(s => s.League)
            .OrderByDescending(s => s.StartDate)
            .ToListAsync();
    }

    public async Task<Season?> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.Seasons
            .Include(s => s.League)
            .Include(s => s.Matches)
                .ThenInclude(m => m.HomeTeam)
            .Include(s => s.Matches)
                .ThenInclude(m => m.AwayTeam)
            .FirstOrDefaultAsync(s => s.SeasonId == id);
    }

    public async Task<List<Season>> GetSeasonsByLeagueAsync(int leagueId)
    {
        return await _context.Seasons
            .Where(s => s.LeagueId == leagueId)
            .OrderByDescending(s => s.StartDate)
            .ToListAsync();
    }

    public async Task<Season?> GetCurrentSeasonByLeagueAsync(int leagueId)
    {
        return await _context.Seasons
            .Include(s => s.League)
            .Where(s => s.LeagueId == leagueId && s.IsCurrent)
            .FirstOrDefaultAsync();
    }
}