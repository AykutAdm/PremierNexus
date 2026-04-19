namespace PremierNexus.DTOs.SeasonDtos;

public class ResultSeasonDto
{
    public int SeasonId { get; set; }
    public int LeagueId { get; set; }
    public string LeagueName { get; set; }
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsCurrent { get; set; }
}