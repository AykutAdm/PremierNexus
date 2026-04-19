using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.MatchEventDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class MatchEventManager : IMatchEventService
{
    private readonly IMatchEventDal _matchEventDal;
    private readonly IMapper _mapper;

    public MatchEventManager(IMatchEventDal matchEventDal, IMapper mapper)
    {
        _matchEventDal = matchEventDal;
        _mapper = mapper;
    }

    public async Task TDeleteAsync(int id)
    {
        await _matchEventDal.DeleteAsync(id);
    }

    public async Task<GetMatchEventByIdDto> TGetByIdAsync(int id)
    {
        var value = await _matchEventDal.GetByIdWithNavigationsAsync(id);
        return _mapper.Map<GetMatchEventByIdDto>(value);
    }

    public async Task<List<ResultMatchEventDto>> TGetListAsync()
    {
        var values = await _matchEventDal.GetListWithNavigationsAsync();
        return _mapper.Map<List<ResultMatchEventDto>>(values);
    }

    public async Task TInsertAsync(CreateMatchEventDto dto)
    {
        var value = _mapper.Map<MatchEvent>(dto);
        await _matchEventDal.InsertAsync(value);
    }

    public async Task TUpdateAsync(UpdateMatchEventDto dto)
    {
        var value = _mapper.Map<MatchEvent>(dto);
        await _matchEventDal.UpdateAsync(value);
    }

    public async Task<List<ResultMatchEventDto>> TGetEventsByMatchAsync(int matchId)
    {
        var values = await _matchEventDal.GetEventsByMatchAsync(matchId);
        return _mapper.Map<List<ResultMatchEventDto>>(values);
    }

    public async Task<List<ResultMatchEventDto>> TGetEventsByTeamAsync(int teamId)
    {
        var values = await _matchEventDal.GetEventsByTeamAsync(teamId);
        return _mapper.Map<List<ResultMatchEventDto>>(values);
    }

    public async Task<List<ResultMatchEventDto>> TGetEventsByActionTypeAsync(string actionType)
    {
        var values = await _matchEventDal.GetEventsByActionTypeAsync(actionType);
        return _mapper.Map<List<ResultMatchEventDto>>(values);
    }
}