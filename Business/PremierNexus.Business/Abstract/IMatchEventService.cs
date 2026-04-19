using PremierNexus.DTOs.MatchEventDtos;

namespace PremierNexus.Business.Abstract;

public interface IMatchEventService
{
    Task<List<ResultMatchEventDto>> TGetListAsync();
    Task<GetMatchEventByIdDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateMatchEventDto dto);
    Task TUpdateAsync(UpdateMatchEventDto dto);
    Task TDeleteAsync(int id);
    Task<List<ResultMatchEventDto>> TGetEventsByMatchAsync(int matchId);
    Task<List<ResultMatchEventDto>> TGetEventsByTeamAsync(int teamId);
    Task<List<ResultMatchEventDto>> TGetEventsByActionTypeAsync(string actionType);
}