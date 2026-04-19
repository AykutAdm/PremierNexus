using PremierNexus.DTOs.TeamDtos;

namespace PremierNexus.Business.Abstract;

public interface ITeamService
{
    Task<List<ResultTeamDto>> TGetListAsync();
    Task<GetTeamByIdDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateTeamDto dto);
    Task TUpdateAsync(UpdateTeamDto dto);
    Task TDeleteAsync(int id);
    Task<List<ResultTeamDto>> TGetTeamsByLeagueAsync(int leagueId);
}