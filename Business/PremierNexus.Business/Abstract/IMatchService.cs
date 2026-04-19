using PremierNexus.DTOs.MatchDtos;

namespace PremierNexus.Business.Abstract;

public interface IMatchService
{
    Task<List<ResultMatchDto>> TGetListAsync();
    Task<GetMatchByIdDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateMatchDto dto);
    Task TUpdateAsync(UpdateMatchDto dto);
    Task TDeleteAsync(int id);
    Task<List<ResultMatchWithTeamLogoDto>> TMatchListWithTeamLogoAsync();
    Task<List<ResultMatchDto>> TGetMatchesBySeasonAsync(int seasonId);
    Task<List<ResultMatchDto>> TGetMatchesByWeekAsync(int seasonId, short weekNumber);
    Task<List<ResultMatchDto>> TGetMatchesByStatusAsync(string status);
    Task<List<MatchWithTeamsDto>> TGetMatchesWithFullNavigationAsync();
}