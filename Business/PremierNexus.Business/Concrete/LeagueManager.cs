using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.LeagueDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class LeagueManager : ILeagueService
{
    private readonly ILeagueDal _leagueDal;
    private readonly IMapper _mapper;

    public LeagueManager(ILeagueDal leagueDal, IMapper mapper)
    {
        _leagueDal = leagueDal;
        _mapper = mapper;
    }

    public async Task<List<ResultLeagueDto>> TGetListAsync()
    {
        var values = await _leagueDal.GetListAsync();
        return _mapper.Map<List<ResultLeagueDto>>(values);
    }

    public async Task<ResultLeagueDto> TGetByIdAsync(int id)
    {
        var value = await _leagueDal.GetByIdAsync(id);
        return _mapper.Map<ResultLeagueDto>(value);
    }

    public async Task TInsertAsync(CreateLeagueDto dto)
    {
        var value = _mapper.Map<League>(dto);
        await _leagueDal.InsertAsync(value);
    }

    public async Task TUpdateAsync(UpdateLeagueDto dto)
    {
        var value = _mapper.Map<League>(dto);
        await _leagueDal.UpdateAsync(value);
    }

    public async Task TDeleteAsync(int id)
    {
        await _leagueDal.DeleteAsync(id);
    }
}