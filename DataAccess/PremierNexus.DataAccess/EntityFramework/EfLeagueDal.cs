using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfLeagueDal : GenericRepository<League>, ILeagueDal
{
    public EfLeagueDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<League>> GetListWithNavigationsAsync()
    {
        return await _context.Leagues
            .Include(x => x.Seasons)
            .Include(x => x.Teams)
            .ToListAsync();
    }

    public async Task<League> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.Leagues
            .Include(x => x.Seasons)
            .Include(x => x.Teams)
            .FirstOrDefaultAsync(x => x.LeagueId == id);
    }
}