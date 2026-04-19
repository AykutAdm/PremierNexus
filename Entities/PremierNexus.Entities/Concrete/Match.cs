namespace PremierNexus.Entities.Concrete;

public class Match
{
    public int MatchId { get; set; }

    // Foreign Keys
    public int SeasonId { get; set; }
    public Season Season { get; set; } = null!;

    public int HomeTeamId { get; set; }
    public Team HomeTeam { get; set; } = null!;

    public int AwayTeamId { get; set; }
    public Team AwayTeam { get; set; } = null!;

    public int StadiumId { get; set; }
    public Stadium Stadium { get; set; } = null!;

    // Match Properties
    public short WeekNumber { get; set; }            // Hafta numarası (1-38)
    public DateTime MatchDate { get; set; }          // Maç tarihi ve saati
    
    public string Status { get; set; } = null!;

    // Score Properties
    public int? HomeScore { get; set; }              // Ev sahibi skoru
    public int? AwayScore { get; set; }              // Deplasman skoru
    public int? HomeScoreHT { get; set; }            // İlk yarı ev sahibi skoru
    public int? AwayScoreHT { get; set; }            // İlk yarı deplasman skoru

    // Additional Match Info
    public string? Referee { get; set; }             // Hakem
    public int? Attendance { get; set; }             // Seyirci sayısı

    // Navigation Properties
    public MatchStatistics MatchStatistics { get; set; }
    public List<MatchEvent> MatchEvents { get; set; }
}