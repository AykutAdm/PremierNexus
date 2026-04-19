using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.MatchStatisticsDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class MatchStatisticsManager : IMatchStatisticsService
{
    private readonly IMatchStatisticsDal _matchStatisticsDal;
    private readonly IMapper _mapper;

    public MatchStatisticsManager(IMatchStatisticsDal matchStatisticsDal, IMapper mapper)
    {
        _matchStatisticsDal = matchStatisticsDal;
        _mapper = mapper;
    }

    public async Task<List<ResultMatchStatisticsDto>> TGetListAsync()
    {
        var values = await _matchStatisticsDal.GetListWithNavigationsAsync();
        return _mapper.Map<List<ResultMatchStatisticsDto>>(values);
    }

    public async Task<ResultMatchStatisticsDto> TGetByIdAsync(int id)
    {
        var value = await _matchStatisticsDal.GetByIdAsync(id);
        return _mapper.Map<ResultMatchStatisticsDto>(value);
    }

    public async Task TInsertAsync(CreateMatchStatisticsDto dto)
    {
        var value = _mapper.Map<MatchStatistics>(dto);
        await _matchStatisticsDal.InsertAsync(value);
    }

    public async Task TDeleteAsync(int id)
    {
        await _matchStatisticsDal.DeleteAsync(id);
    }

    public async Task<ResultMatchStatisticsDto?> TGetByMatchIdAsync(int matchId)
    {
        var value = await _matchStatisticsDal.GetByMatchIdWithNavigationsAsync(matchId);
        return _mapper.Map<ResultMatchStatisticsDto>(value);
    }
}