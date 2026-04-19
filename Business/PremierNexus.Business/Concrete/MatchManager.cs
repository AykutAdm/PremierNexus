using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.MatchDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class MatchManager : IMatchService
{
    private readonly IMatchDal _matchDal;
    private readonly IMapper _mapper;

    public MatchManager(IMatchDal matchDal, IMapper mapper)
    {
        _matchDal = matchDal;
        _mapper = mapper;
    }

    public async Task TDeleteAsync(int id)
    {
        await _matchDal.DeleteAsync(id);
    }

    public async Task<GetMatchByIdDto> TGetByIdAsync(int id)
    {
        var value = await _matchDal.GetByIdWithNavigationsAsync(id);
        return _mapper.Map<GetMatchByIdDto>(value);
    }

    public async Task<List<ResultMatchDto>> TGetListAsync()
    {
        var values = await _matchDal.GetListWithNavigationsAsync();
        return _mapper.Map<List<ResultMatchDto>>(values);
    }

    public async Task TInsertAsync(CreateMatchDto dto)
    {
        var value = _mapper.Map<Match>(dto);
        await _matchDal.InsertAsync(value);
    }

    public async Task<List<ResultMatchWithTeamLogoDto>> TMatchListWithTeamLogoAsync()
    {
        var values = await _matchDal.MatchListWithTeamLogoAsync();
        return _mapper.Map<List<ResultMatchWithTeamLogoDto>>(values);
    }

    public async Task TUpdateAsync(UpdateMatchDto dto)
    {
        var value = _mapper.Map<Match>(dto);
        await _matchDal.UpdateAsync(value);
    }

    public async Task<List<ResultMatchDto>> TGetMatchesBySeasonAsync(int seasonId)
    {
        var values = await _matchDal.GetMatchesBySeasonAsync(seasonId);
        return _mapper.Map<List<ResultMatchDto>>(values);
    }

    public async Task<List<ResultMatchDto>> TGetMatchesByWeekAsync(int seasonId, short weekNumber)
    {
        var values = await _matchDal.GetMatchesByWeekAsync(seasonId, weekNumber);
        return _mapper.Map<List<ResultMatchDto>>(values);
    }

    public async Task<List<ResultMatchDto>> TGetMatchesByStatusAsync(string status)
    {
        var values = await _matchDal.GetMatchesByStatusAsync(status);
        return _mapper.Map<List<ResultMatchDto>>(values);
    }

    public async Task<List<MatchWithTeamsDto>> TGetMatchesWithFullNavigationAsync()
    {
        var values = await _matchDal.GetMatchesWithFullNavigationAsync();
        return _mapper.Map<List<MatchWithTeamsDto>>(values);
    }
}