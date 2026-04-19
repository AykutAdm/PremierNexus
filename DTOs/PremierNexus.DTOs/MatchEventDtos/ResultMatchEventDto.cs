namespace PremierNexus.DTOs.MatchEventDtos;

public class ResultMatchEventDto
{
    public int MatchEventId { get; set; }
    public int MatchId { get; set; }
    public int TeamId { get; set; }
    public string TeamName { get; set; }
    public short Minute { get; set; }
    public byte? ExtraMinute { get; set; }
    public string ActionType { get; set; }
    public string Description { get; set; }
}