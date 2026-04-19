using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.TeamDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTeams()
    {
        var values = await _teamService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeam(int id)
    {
        var value = await _teamService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTeam(CreateTeamDto dto)
    {
        await _teamService.TInsertAsync(dto);
        return Ok("Takım Eklendi");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTeam(UpdateTeamDto dto)
    {
        await _teamService.TUpdateAsync(dto);
        return Ok("Takım Güncellendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        await _teamService.TDeleteAsync(id);
        return Ok("Takım Silindi");
    }

    [HttpGet("league/{leagueId}")]
    public async Task<IActionResult> GetTeamsByLeague(int leagueId)
    {
        var values = await _teamService.TGetTeamsByLeagueAsync(leagueId);
        return Ok(values);
    }
}