namespace PremierNexus.DTOs.StandingDtos;

public class StandingDto
{
    public int TeamId { get; set; }
    public string TeamName { get; set; }
    public string TeamLogo { get; set; }
    public string ShortName { get; set; }
    
    // Temel istatistikler
    public int Played { get; set; }       // Oynanan maç
    public int Won { get; set; }          // Galibiyet
    public int Drawn { get; set; }        // Beraberlik  
    public int Lost { get; set; }         // Mağlubiyet
    public int Points { get; set; }       // Puan (3-1-0 kuralı)
    
    // Gol istatistikleri
    public int GoalsFor { get; set; }     // Atılan gol
    public int GoalsAgainst { get; set; } // Yenilen gol
    public int GoalDifference { get; set; } // Averaj
    
    // Hocanın istediği Son 5 maç formu
    public string LastFiveResults { get; set; }  // "WDLWW" formatında
}