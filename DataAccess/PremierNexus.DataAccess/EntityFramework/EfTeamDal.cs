using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfTeamDal : GenericRepository<Team>, ITeamDal
{
    public EfTeamDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<Team>> GetListWithNavigationsAsync()
    {
        return await _context.Teams
            .Include(t => t.League)
            .Include(t => t.HomeStadium)
            .ToListAsync();
    }

    public async Task<Team?> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.Teams
            .Include(t => t.League)
            .Include(t => t.HomeStadium)
            .FirstOrDefaultAsync(t => t.TeamId == id);
    }

    public async Task<List<Team>> GetTeamsByLeagueAsync(int leagueId)
    {
        return await _context.Teams
            .Include(t => t.HomeStadium)
            .Where(t => t.LeagueId == leagueId)
            .ToListAsync();
    }
}