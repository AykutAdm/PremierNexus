using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.TeamDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class TeamManager : ITeamService
{
    private readonly ITeamDal _teamDal;
    private readonly IMapper _mapper;

    public TeamManager(ITeamDal teamDal, IMapper mapper)
    {
        _teamDal = teamDal;
        _mapper = mapper;
    }

    public async Task TDeleteAsync(int id)
    {
        await _teamDal.DeleteAsync(id);
    }

    public async Task<GetTeamByIdDto> TGetByIdAsync(int id)
    {
        var value = await _teamDal.GetByIdWithNavigationsAsync(id);
        return _mapper.Map<GetTeamByIdDto>(value);
    }

    public async Task<List<ResultTeamDto>> TGetListAsync()
    {
        var values = await _teamDal.GetListWithNavigationsAsync();
        return _mapper.Map<List<ResultTeamDto>>(values);
    }

    public async Task TInsertAsync(CreateTeamDto dto)
    {
        var value = _mapper.Map<Team>(dto);
        await _teamDal.InsertAsync(value);
    }

    public async Task TUpdateAsync(UpdateTeamDto dto)
    {
        var value = _mapper.Map<Team>(dto);
        await _teamDal.UpdateAsync(value);
    }

    public async Task<List<ResultTeamDto>> TGetTeamsByLeagueAsync(int leagueId)
    {
        var values = await _teamDal.GetTeamsByLeagueAsync(leagueId);
        return _mapper.Map<List<ResultTeamDto>>(values);
    }
}