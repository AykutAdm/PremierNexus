namespace PremierNexus.DTOs.StadiumDtos;

public class UpdateStadiumDto
{
    public int StadiumId { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public int? Capacity { get; set; }
}
