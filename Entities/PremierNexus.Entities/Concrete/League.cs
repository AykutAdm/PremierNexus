namespace PremierNexus.Entities.Concrete;

public class League
{
    public int LeagueId { get; set; }
    public string Name { get; set; } = null!;        // Premier League
    public string? Country { get; set; }             // England

    // Navigation Properties
    public List<Season> Seasons { get; set; }
    public List<Team> Teams { get; set; }
}