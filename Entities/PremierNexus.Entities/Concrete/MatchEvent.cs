namespace PremierNexus.Entities.Concrete;

public class MatchEvent
{
    public int MatchEventId { get; set; }

    // Foreign Keys
    public int MatchId { get; set; }
    public Match Match { get; set; } = null!;

    public int TeamId { get; set; }
    public Team Team { get; set; } = null!;

    // Event Properties
    public short Minute { get; set; }                // Dakika (1-120)
    public byte? ExtraMinute { get; set; }           // Ek dakika (+3, +5 vb.)
    
    public string ActionType { get; set; } = null!;

    public string Description { get; set; } = null!;
}