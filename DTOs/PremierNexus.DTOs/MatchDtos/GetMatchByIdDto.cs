namespace PremierNexus.DTOs.MatchDtos;

public class GetMatchByIdDto
{
    public int MatchId { get; set; }
    public int SeasonId { get; set; }
    public string SeasonName { get; set; }
    public short WeekNumber { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public int StadiumId { get; set; }
    public string StadiumName { get; set; }
    public DateTime MatchDate { get; set; }
    public string Status { get; set; }
    public int? HomeScore { get; set; }
    public int? AwayScore { get; set; }
    public int? HomeScoreHT { get; set; }
    public int? AwayScoreHT { get; set; }
    public string? Referee { get; set; }
    public int? Attendance { get; set; }
}