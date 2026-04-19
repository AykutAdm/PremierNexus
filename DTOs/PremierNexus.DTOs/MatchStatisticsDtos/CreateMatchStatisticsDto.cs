namespace PremierNexus.DTOs.MatchStatisticsDtos;

public class CreateMatchStatisticsDto
{
    public int MatchId { get; set; }
    public byte? HomePossessionPct { get; set; }
    public byte? AwayPossessionPct { get; set; }
    public int? HomeShots { get; set; }
    public int? AwayShots { get; set; }
    public int? HomeShotsOnTarget { get; set; }
    public int? AwayShotsOnTarget { get; set; }
    public int? HomePasses { get; set; }
    public int? AwayPasses { get; set; }
    public byte? HomePassAccuracyPct { get; set; }
    public byte? AwayPassAccuracyPct { get; set; }
    public int? HomeCorners { get; set; }
    public int? AwayCorners { get; set; }
    public int? HomeFouls { get; set; }
    public int? AwayFouls { get; set; }
    public int? HomeOffsides { get; set; }
    public int? AwayOffsides { get; set; }
    public int? HomeYellowCards { get; set; }
    public int? AwayYellowCards { get; set; }
    public int? HomeRedCards { get; set; }
    public int? AwayRedCards { get; set; }
}