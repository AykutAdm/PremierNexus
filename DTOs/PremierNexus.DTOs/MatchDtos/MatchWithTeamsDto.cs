namespace PremierNexus.DTOs.MatchDtos;

public class MatchWithTeamsDto
{
    public int MatchId { get; set; }
    public int SeasonId { get; set; }
    public string SeasonName { get; set; }
    public short WeekNumber { get; set; }
    public DateTime MatchDate { get; set; }
    public string Status { get; set; }
    public int? HomeScore { get; set; }
    public int? AwayScore { get; set; }
    public int? HomeScoreHT { get; set; }
    public int? AwayScoreHT { get; set; }
    public string? Referee { get; set; }
    public int? Attendance { get; set; }

    // Home Team Navigation
    public int HomeTeamId { get; set; }
    public string HomeTeamName { get; set; }
    public string HomeTeamShortName { get; set; }
    public string HomeTeamLogo { get; set; }

    // Away Team Navigation  
    public int AwayTeamId { get; set; }
    public string AwayTeamName { get; set; }
    public string AwayTeamShortName { get; set; }
    public string AwayTeamLogo { get; set; }

    // Stadium Navigation
    public int StadiumId { get; set; }
    public string StadiumName { get; set; }
}