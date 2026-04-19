using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface ISeasonDal : IGenericDal<Season>
{
    Task<List<Season>> GetListWithNavigationsAsync();
    Task<Season> GetByIdWithNavigationsAsync(int id);
    Task<List<Season>> GetSeasonsByLeagueAsync(int leagueId);
    Task<Season> GetCurrentSeasonByLeagueAsync(int leagueId);
}