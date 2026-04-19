namespace PremierNexus.Entities.Concrete;

public class Team
{
    public int TeamId { get; set; }
    
    // Foreign Keys
    public int LeagueId { get; set; }
    public League League { get; set; } = null!;
    
    public int? HomeStadiumId { get; set; }
    public Stadium? HomeStadium { get; set; }

    // Team Properties
    public string Name { get; set; } = null!;        // Manchester United
    public string ShortName { get; set; } = null!;   // Man Utd
    public string City { get; set; } = null!;        // Manchester
    public string LogoUrl { get; set; } = null!;     // takım logosu URL
    public int? Founded { get; set; }                // 1878
    public bool IsActive { get; set; }               // ligde aktif mi

    // Navigation Properties
    public List<Match> HomeMatches { get; set; }
    public List<Match> AwayMatches { get; set; }
    public List<MatchEvent> MatchEvents { get; set; }
}