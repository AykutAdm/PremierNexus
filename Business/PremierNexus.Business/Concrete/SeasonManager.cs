using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.SeasonDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class SeasonManager : ISeasonService
{
    private readonly ISeasonDal _seasonDal;
    private readonly IMapper _mapper;

    public SeasonManager(ISeasonDal seasonDal, IMapper mapper)
    {
        _seasonDal = seasonDal;
        _mapper = mapper;
    }

    public async Task<List<ResultSeasonDto>> TGetListAsync()
    {
        var values = await _seasonDal.GetListWithNavigationsAsync();
        return _mapper.Map<List<ResultSeasonDto>>(values);
    }

    public async Task<ResultSeasonDto> TGetByIdAsync(int id)
    {
        var value = await _seasonDal.GetByIdWithNavigationsAsync(id);
        return _mapper.Map<ResultSeasonDto>(value);
    }

    public async Task TInsertAsync(CreateSeasonDto dto)
    {
        var value = _mapper.Map<Season>(dto);
        await _seasonDal.InsertAsync(value);
    }

    public async Task TDeleteAsync(int id)
    {
        await _seasonDal.DeleteAsync(id);
    }

    public async Task<List<ResultSeasonDto>> TGetSeasonsByLeagueAsync(int leagueId)
    {
        var values = await _seasonDal.GetSeasonsByLeagueAsync(leagueId);
        return _mapper.Map<List<ResultSeasonDto>>(values);
    }

    public async Task<ResultSeasonDto?> TGetCurrentSeasonByLeagueAsync(int leagueId)
    {
        var value = await _seasonDal.GetCurrentSeasonByLeagueAsync(leagueId);
        return _mapper.Map<ResultSeasonDto>(value);
    }
}