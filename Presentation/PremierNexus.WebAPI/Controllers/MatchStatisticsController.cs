using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.MatchStatisticsDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MatchStatisticsController : ControllerBase
{
    private readonly IMatchStatisticsService _matchStatisticsService;

    public MatchStatisticsController(IMatchStatisticsService matchStatisticsService)
    {
        _matchStatisticsService = matchStatisticsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMatchStatistics()
    {
        var values = await _matchStatisticsService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatchStatistic(int id)
    {
        var value = await _matchStatisticsService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMatchStatistics(CreateMatchStatisticsDto dto)
    {
        await _matchStatisticsService.TInsertAsync(dto);
        return Ok("Maç İstatistiği Eklendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatchStatistics(int id)
    {
        await _matchStatisticsService.TDeleteAsync(id);
        return Ok("Maç İstatistiği Silindi");
    }

    [HttpGet("match/{matchId}")]
    public async Task<IActionResult> GetMatchStatisticsByMatchId(int matchId)
    {
        var value = await _matchStatisticsService.TGetByMatchIdAsync(matchId);
        if (value == null)
            return NotFound("Maça ait istatistik bulunamadı");
        return Ok(value);
    }
}