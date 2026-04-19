using PremierNexus.DTOs.MatchStatisticsDtos;

namespace PremierNexus.Business.Abstract;

public interface IMatchStatisticsService
{
    Task<List<ResultMatchStatisticsDto>> TGetListAsync();
    Task<ResultMatchStatisticsDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateMatchStatisticsDto dto);
    Task TDeleteAsync(int id);
    Task<ResultMatchStatisticsDto?> TGetByMatchIdAsync(int matchId);
}