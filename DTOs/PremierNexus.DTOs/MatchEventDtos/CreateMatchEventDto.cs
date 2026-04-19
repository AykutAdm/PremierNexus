namespace PremierNexus.DTOs.MatchEventDtos;

public class CreateMatchEventDto
{
    public int MatchId { get; set; }
    public int TeamId { get; set; }
    public short Minute { get; set; }
    public byte? ExtraMinute { get; set; }
    public string ActionType { get; set; }    // "Goal", "YellowCard", "RedCard", "Substitution"
    public string Description { get; set; }  
}