namespace PremierNexus.Entities.Concrete;

public class Stadium
{
    public int StadiumId { get; set; }
    public string Name { get; set; } = null!;        // Old Trafford
    public string City { get; set; } = null!;        // Manchester
    public int? Capacity { get; set; }               // 75000

    // Navigation Properties
    public List<Team> TeamsWithHomeStadium { get; set; }
    public List<Match> Matches { get; set; }
}