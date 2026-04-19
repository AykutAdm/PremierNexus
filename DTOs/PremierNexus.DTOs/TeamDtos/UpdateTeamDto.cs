namespace PremierNexus.DTOs.TeamDtos;

public class UpdateTeamDto
{
    public int TeamId { get; set; }
    public int LeagueId { get; set; }
    public int? HomeStadiumId { get; set; }
    public string Name { get; set; }
    public string ShortName { get; set; }
    public string City { get; set; }
    public string LogoUrl { get; set; }
    public int? Founded { get; set; }
    public bool IsActive { get; set; }
}