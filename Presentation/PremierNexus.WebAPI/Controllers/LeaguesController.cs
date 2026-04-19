using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.LeagueDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LeaguesController : ControllerBase
{
    private readonly ILeagueService _leagueService;

    public LeaguesController(ILeagueService leagueService)
    {
        _leagueService = leagueService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeagues()
    {
        var values = await _leagueService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLeague(int id)
    {
        var value = await _leagueService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLeague(CreateLeagueDto dto)
    {
        await _leagueService.TInsertAsync(dto);
        return Ok("Lig Eklendi");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateLeague(UpdateLeagueDto dto)
    {
        await _leagueService.TUpdateAsync(dto);
        return Ok("Lig Güncellendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeague(int id)
    {
        await _leagueService.TDeleteAsync(id);
        return Ok("Lig Silindi");
    }
}