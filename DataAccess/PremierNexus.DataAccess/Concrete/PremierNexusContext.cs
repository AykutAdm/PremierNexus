using Microsoft.EntityFrameworkCore;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Concrete;

public class PremierNexusContext : DbContext
{
    public PremierNexusContext(DbContextOptions<PremierNexusContext> options) : base(options)
    {
    }

    public DbSet<League> Leagues { get; set; }
    public DbSet<Season> Seasons { get; set; }
    public DbSet<Stadium> Stadiums { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<MatchEvent> MatchEvents { get; set; }
    public DbSet<MatchStatistics> MatchStatistics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //1-to-1 ilişki 
        modelBuilder.Entity<MatchStatistics>()
            .HasOne(ms => ms.Match)
            .WithOne(m => m.MatchStatistics)
            .HasForeignKey<MatchStatistics>(ms => ms.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        //Home/Away Team ilişkileri
        modelBuilder.Entity<Match>()
            .HasOne(m => m.HomeTeam)
            .WithMany(t => t.HomeMatches)
            .HasForeignKey(m => m.HomeTeamId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Match>()
            .HasOne(m => m.AwayTeam)
            .WithMany(t => t.AwayMatches)
            .HasForeignKey(m => m.AwayTeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // MatchEvent → Team ilişkisi
        modelBuilder.Entity<MatchEvent>()
            .HasOne(me => me.Team)
            .WithMany(t => t.MatchEvents)
            .HasForeignKey(me => me.TeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // Performans için index'ler
        modelBuilder.Entity<Match>()
            .HasIndex(m => m.Status);
            
        modelBuilder.Entity<MatchStatistics>()
            .HasIndex(ms => ms.MatchId)
            .IsUnique();
    }
}