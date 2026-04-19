namespace PremierNexus.Entities.Concrete;

public class Season
{
    public int SeasonId { get; set; }
    public int LeagueId { get; set; }
    public League League { get; set; } = null!;
    
    public string Name { get; set; } = null!;        // 2024-2025
    public DateTime StartDate { get; set; }          // Sezon başlangıç
    public DateTime EndDate { get; set; }            // Sezon bitiş
    public bool IsCurrent { get; set; }              // Aktif sezon mu

    // Navigation Properties
    public List<Match> Matches { get; set; }
}