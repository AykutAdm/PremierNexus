using Microsoft.EntityFrameworkCore;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.RepositoryDesignPattern;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.EntityFramework;

public class EfStadiumDal : GenericRepository<Stadium>, IStadiumDal
{
    public EfStadiumDal(PremierNexusContext context) : base(context)
    {
    }

    public async Task<List<Stadium>> GetListWithNavigationsAsync()
    {
        return await _context.Stadiums
            .Include(s => s.TeamsWithHomeStadium)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<Stadium?> GetByIdWithNavigationsAsync(int id)
    {
        return await _context.Stadiums
            .Include(s => s.TeamsWithHomeStadium)
            .Include(s => s.Matches)
                .ThenInclude(m => m.HomeTeam)
            .Include(s => s.Matches)
                .ThenInclude(m => m.AwayTeam)
            .FirstOrDefaultAsync(s => s.StadiumId == id);
    }

    public async Task<List<Stadium>> GetStadiumsByCityAsync(string city)
    {
        return await _context.Stadiums
            .Where(s => s.City == city)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }
}