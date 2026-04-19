using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface IMatchDal : IGenericDal<Match>
{
    Task<List<Match>> GetListWithNavigationsAsync();
    Task<Match?> GetByIdWithNavigationsAsync(int id);
    Task<List<Match>> MatchListWithTeamLogoAsync();
    Task<List<Match>> GetMatchesBySeasonAsync(int seasonId);
    Task<List<Match>> GetMatchesByWeekAsync(int seasonId, short weekNumber);
    Task<List<Match>> GetMatchesByStatusAsync(string status);
    Task<List<Match>> GetFinishedMatchesByTeamAsync(int teamId);
    Task<List<Match>> GetMatchesWithFullNavigationAsync();
}