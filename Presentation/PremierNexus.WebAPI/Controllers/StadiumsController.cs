using Microsoft.AspNetCore.Mvc;
using PremierNexus.Business.Abstract;
using PremierNexus.DTOs.StadiumDtos;

namespace PremierNexus.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StadiumsController : ControllerBase
{
    private readonly IStadiumService _stadiumService;

    public StadiumsController(IStadiumService stadiumService)
    {
        _stadiumService = stadiumService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStadiums()
    {
        var values = await _stadiumService.TGetListAsync();
        return Ok(values);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStadium(int id)
    {
        var value = await _stadiumService.TGetByIdAsync(id);
        return Ok(value);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStadium(CreateStadiumDto dto)
    {
        await _stadiumService.TInsertAsync(dto);
        return Ok("Stadyum Eklendi");
    }

    [HttpPut]
    public async Task<IActionResult> UpdateStadium(UpdateStadiumDto dto)
    {
        await _stadiumService.TUpdateAsync(dto);
        return Ok("Stadyum Güncellendi");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStadium(int id)
    {
        await _stadiumService.TDeleteAsync(id);
        return Ok("Stadyum Silindi");
    }

    [HttpGet("city/{city}")]
    public async Task<IActionResult> GetStadiumsByCity(string city)
    {
        var values = await _stadiumService.TGetStadiumsByCityAsync(city);
        return Ok(values);
    }
}