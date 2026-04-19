using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DTOs.StandingDtos;

namespace PremierNexus.Business.Concrete;


public class StandingManager : IStandingService
{
    private readonly PremierNexusContext _context;

    public StandingManager(PremierNexusContext context)
    {
        _context = context;
    }

    public async Task<List<StandingDto>> TGetStandingsBySeasonAsync(int seasonId)
    {
        // Stored procedure çağrısı
        var parameter = new SqlParameter("@SeasonId", seasonId);

        var standings = await _context.Database
            .SqlQueryRaw<StandingDto>("EXEC sp_GetStandingsBySeasonId @SeasonId", parameter)
            .ToListAsync();

        return standings;
    }

    public async Task<List<StandingDto>> TGetCurrentStandingsAsync(int leagueId)
    {
        // Aktif sezon için puan durumu
        var parameter = new SqlParameter("@LeagueId", leagueId);

        var standings = await _context.Database
            .SqlQueryRaw<StandingDto>("EXEC sp_GetCurrentStandingsByLeagueId @LeagueId", parameter)
            .ToListAsync();

        return standings;
    }
}