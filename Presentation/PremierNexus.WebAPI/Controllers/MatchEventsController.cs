using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.MatchEventDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MatchEventsController : ControllerBase
{
    private readonly IMatchEventService _matchEventService;

    public MatchEventsController(IMatchEventService matchEventService)
    {
        _matchEventService = matchEventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMatchEvents()
    {
        var values = await _matchEventService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatchEvent(int id)
    {
        var value = await _matchEventService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMatchEvent(CreateMatchEventDto dto)
    {
        await _matchEventService.TInsertAsync(dto);
        return Ok("Maç Olayı Eklendi");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateMatchEvent(UpdateMatchEventDto dto)
    {
        await _matchEventService.TUpdateAsync(dto);
        return Ok("Maç Olayı Güncellendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMatchEvent(int id)
    {
        await _matchEventService.TDeleteAsync(id);
        return Ok("Maç Olayı Silindi");
    }

    [HttpGet("match/{matchId}")]
    public async Task<IActionResult> GetEventsByMatchId(int matchId)
    {
        var values = await _matchEventService.TGetEventsByMatchAsync(matchId);
        return Ok(values);
    }

    [HttpGet("team/{teamId}")]
    public async Task<IActionResult> GetEventsByTeamId(int teamId)
    {
        var values = await _matchEventService.TGetEventsByTeamAsync(teamId);
        return Ok(values);
    }

    [HttpGet("action/{actionType}")]
    public async Task<IActionResult> GetEventsByActionType(string actionType)
    {
        var values = await _matchEventService.TGetEventsByActionTypeAsync(actionType);
        return Ok(values);
    }
}