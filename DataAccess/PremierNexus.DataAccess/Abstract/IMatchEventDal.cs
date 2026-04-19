using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface IMatchEventDal : IGenericDal<MatchEvent>
{
    Task<List<MatchEvent>> GetListWithNavigationsAsync();
    Task<MatchEvent> GetByIdWithNavigationsAsync(int id);
    Task<List<MatchEvent>> GetEventsByMatchAsync(int matchId);
    Task<List<MatchEvent>> GetEventsByTeamAsync(int teamId);
    Task<List<MatchEvent>> GetEventsByActionTypeAsync(string actionType);
}