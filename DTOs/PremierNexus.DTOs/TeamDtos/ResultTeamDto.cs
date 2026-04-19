namespace PremierNexus.DTOs.TeamDtos;

public class ResultTeamDto
{
    public int TeamId { get; set; }
    public int LeagueId { get; set; }
    public string LeagueName { get; set; }
    public int? HomeStadiumId { get; set; }
    public string? HomeStadiumName { get; set; }
    public string Name { get; set; }
    public string ShortName { get; set; }
    public string City { get; set; }
    public string LogoUrl { get; set; }
    public int? Founded { get; set; }
    public bool IsActive { get; set; }
}