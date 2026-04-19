using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.SeasonDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SeasonsController : ControllerBase
{
    private readonly ISeasonService _seasonService;

    public SeasonsController(ISeasonService seasonService)
    {
        _seasonService = seasonService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSeasons()
    {
        var values = await _seasonService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSeason(int id)
    {
        var value = await _seasonService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSeason(CreateSeasonDto dto)
    {
        await _seasonService.TInsertAsync(dto);
        return Ok("Sezon Eklendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSeason(int id)
    {
        await _seasonService.TDeleteAsync(id);
        return Ok("Sezon Silindi");
    }

    [HttpGet("league/{leagueId}")]
    public async Task<IActionResult> GetSeasonsByLeague(int leagueId)
    {
        var values = await _seasonService.TGetSeasonsByLeagueAsync(leagueId);
        return Ok(values);
    }

    [HttpGet("current/{leagueId}")]
    public async Task<IActionResult> GetCurrentSeasonByLeague(int leagueId)
    {
        var value = await _seasonService.TGetCurrentSeasonByLeagueAsync(leagueId);
        if (value == null)
            return NotFound("Aktif sezon bulunamadı");
        return Ok(value);
    }
}