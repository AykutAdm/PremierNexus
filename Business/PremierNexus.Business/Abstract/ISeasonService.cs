using PremierNexus.DTOs.SeasonDtos;

namespace PremierNexus.Business.Abstract;

public interface ISeasonService
{
    Task<List<ResultSeasonDto>> TGetListAsync();
    Task<ResultSeasonDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateSeasonDto dto);
    Task TDeleteAsync(int id);
    Task<List<ResultSeasonDto>> TGetSeasonsByLeagueAsync(int leagueId);
    Task<ResultSeasonDto?> TGetCurrentSeasonByLeagueAsync(int leagueId);
}