using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.MatchDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MatchesController : ControllerBase
{
    private readonly IMatchService _matchService;

    public MatchesController(IMatchService matchService)
    {
        _matchService = matchService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMatches()
    {
        var values = await _matchService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatch(int id)
    {
        var value = await _matchService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMatch(CreateMatchDto dto)
    {
        await _matchService.TInsertAsync(dto);
        return Ok("Maç Eklendi");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateMatch(UpdateMatchDto dto)
    {
        await _matchService.TUpdateAsync(dto);
        return Ok("Maç Güncellendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatch(int id)
    {
        await _matchService.TDeleteAsync(id);
        return Ok("Maç Silindi");
    }

    [HttpGet("with-teams")]
    public async Task<IActionResult> GetMatchesWithTeamLogos()
    {
        var values = await _matchService.TMatchListWithTeamLogoAsync();
        return Ok(values);
    }

    [HttpGet("season/{seasonId}")]
    public async Task<IActionResult> GetMatchesBySeasonId(int seasonId)
    {
        var values = await _matchService.TGetMatchesBySeasonAsync(seasonId);
        return Ok(values);
    }

    [HttpGet("season/{seasonId}/week/{weekNumber}")]
    public async Task<IActionResult> GetMatchesByWeek(int seasonId, short weekNumber)
    {
        var values = await _matchService.TGetMatchesByWeekAsync(seasonId, weekNumber);
        return Ok(values);
    }

    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetMatchesByStatus(string status)
    {
        var values = await _matchService.TGetMatchesByStatusAsync(status);
        return Ok(values);
    }

    [HttpGet("with-full-navigation")]
    public async Task<IActionResult> GetMatchesWithFullNavigation()
    {
        var values = await _matchService.TGetMatchesWithFullNavigationAsync();
        return Ok(values);
    }
}