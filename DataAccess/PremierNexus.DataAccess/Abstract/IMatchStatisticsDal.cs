using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface IMatchStatisticsDal : IGenericDal<MatchStatistics>
{
    Task<MatchStatistics> GetByMatchIdAsync(int matchId);
    Task<MatchStatistics> GetByMatchIdWithNavigationsAsync(int matchId);
    Task<List<MatchStatistics>> GetListWithNavigationsAsync();
}