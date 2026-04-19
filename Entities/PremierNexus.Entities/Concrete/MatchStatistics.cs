namespace PremierNexus.Entities.Concrete;

public class MatchStatistics
{
    public int MatchStatisticsId { get; set; }
    
    // Foreign Key
    public int MatchId { get; set; }
    public Match Match { get; set; } = null!;

    // Possession
    public byte? HomePossessionPct { get; set; }     // Ev sahibi top sahipliği %
    public byte? AwayPossessionPct { get; set; }     // Deplasman top sahipliği %

    // Shots
    public int? HomeShots { get; set; }              // Ev sahibi toplam şut
    public int? AwayShots { get; set; }              // Deplasman toplam şut
    public int? HomeShotsOnTarget { get; set; }      // Ev sahibi isabetli şut
    public int? AwayShotsOnTarget { get; set; }      // Deplasman isabetli şut

    // Passes
    public int? HomePasses { get; set; }             // Ev sahibi toplam pas
    public int? AwayPasses { get; set; }             // Deplasman toplam pas
    public byte? HomePassAccuracyPct { get; set; }   // Ev sahibi pas isabet %
    public byte? AwayPassAccuracyPct { get; set; }   // Deplasman pas isabet %

    // Other Stats
    public int? HomeCorners { get; set; }            // Ev sahibi korner
    public int? AwayCorners { get; set; }            // Deplasman korner
    public int? HomeFouls { get; set; }              // Ev sahibi faul
    public int? AwayFouls { get; set; }              // Deplasman faul
    public int? HomeOffsides { get; set; }           // Ev sahibi ofsayt
    public int? AwayOffsides { get; set; }           // Deplasman ofsayt

    // Cards
    public int? HomeYellowCards { get; set; }        // Ev sahibi sarı kart
    public int? AwayYellowCards { get; set; }        // Deplasman sarı kart
    public int? HomeRedCards { get; set; }           // Ev sahibi kırmızı kart
    public int? AwayRedCards { get; set; }           // Deplasman kırmızı kart
}