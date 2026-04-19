using PremierNexus.DTOs.StandingDtos;

namespace PremierNexus.Business.Abstract;

public interface IStandingService
{
    Task<List<StandingDto>> TGetStandingsBySeasonAsync(int seasonId);
    Task<List<StandingDto>> TGetCurrentStandingsAsync(int leagueId);
}