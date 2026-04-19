using PremierNexus.DTOs.LeagueDtos;

namespace PremierNexus.Business.Abstract;

public interface ILeagueService
{
    Task<List<ResultLeagueDto>> TGetListAsync();
    Task<ResultLeagueDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateLeagueDto dto);
    Task TUpdateAsync(UpdateLeagueDto dto);
    Task TDeleteAsync(int id);
}