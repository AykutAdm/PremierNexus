using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface ITeamDal : IGenericDal<Team>
{
    Task<List<Team>> GetListWithNavigationsAsync();
    Task<Team> GetByIdWithNavigationsAsync(int id);
    Task<List<Team>> GetTeamsByLeagueAsync(int leagueId);
}