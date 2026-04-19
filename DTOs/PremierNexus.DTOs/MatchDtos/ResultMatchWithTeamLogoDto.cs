using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PremierNexus.DTOs.MatchDtos
{
    public class ResultMatchWithTeamLogoDto
    {
        public int MatchId { get; set; }
        public int HomeTeamId { get; set; }
        public string HomeTeamName { get; set; }
        public string HomeTeamLogo { get; set; }
        public int AwayTeamId { get; set; }
        public string AwayTeamName { get; set; }
        public string AwayTeamLogo { get; set; }
        public DateTime MatchDate { get; set; }
        public string Stadium { get; set; }
        public int? HomeScore { get; set; }
        public int? AwayScore { get; set; }
        
    }
}
