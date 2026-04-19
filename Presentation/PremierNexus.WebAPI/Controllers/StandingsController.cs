using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StandingsController : ControllerBase
{
    private readonly IStandingService _standingService;

    public StandingsController(IStandingService standingService)
    {
        _standingService = standingService;
    }


    /// Sezona göre puan durumu (Stored Procedure ile dinamik hesaplama)

    [HttpGet("season/{seasonId}")]
    public async Task<IActionResult> GetStandingsBySeasonId(int seasonId)
    {
        var values = await _standingService.TGetStandingsBySeasonAsync(seasonId);
        return Ok(values);
    }

    /// Aktif sezon puan durumu (Stored Procedure ile dinamik hesaplama)

    [HttpGet("current/{leagueId}")]
    public async Task<IActionResult> GetCurrentStandings(int leagueId)
    {
        var values = await _standingService.TGetCurrentStandingsAsync(leagueId);
        return Ok(values);
    }
}