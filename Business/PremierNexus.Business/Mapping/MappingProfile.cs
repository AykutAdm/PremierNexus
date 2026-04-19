using AutoMapper;
using PremierNexus.DTOs.LeagueDtos;
using PremierNexus.DTOs.MatchDtos;
using PremierNexus.DTOs.MatchEventDtos;
using PremierNexus.DTOs.MatchStatisticsDtos;
using PremierNexus.DTOs.SeasonDtos;
using PremierNexus.DTOs.StadiumDtos;
using PremierNexus.DTOs.TeamDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // League
        CreateMap<League, ResultLeagueDto>().ReverseMap();
        CreateMap<League, CreateLeagueDto>().ReverseMap();
        CreateMap<League, UpdateLeagueDto>().ReverseMap();

        // Season
        CreateMap<Season, ResultSeasonDto>()
            .ForMember(d => d.LeagueName, opt => opt.MapFrom(s => s.League.Name));
        CreateMap<Season, CreateSeasonDto>().ReverseMap();

        // Stadium
        CreateMap<Stadium, ResultStadiumDto>().ReverseMap();
        CreateMap<Stadium, CreateStadiumDto>().ReverseMap();
        CreateMap<Stadium, UpdateStadiumDto>().ReverseMap();

        // Team
        CreateMap<Team, ResultTeamDto>()
      .ForMember(d => d.LeagueName, opt => opt.MapFrom(s => s.League.Name))
      .ForMember(d => d.HomeStadiumName, opt => opt.MapFrom(s => s.HomeStadium.Name));

        CreateMap<Team, GetTeamByIdDto>()
            .ForMember(d => d.LeagueName, opt => opt.MapFrom(s => s.League.Name))
            .ForMember(d => d.HomeStadiumName, opt => opt.MapFrom(s => s.HomeStadium.Name));

        CreateMap<Team, CreateTeamDto>().ReverseMap();
        CreateMap<Team, UpdateTeamDto>().ReverseMap();

        // Match
        CreateMap<Match, ResultMatchDto>()
            .ForMember(d => d.SeasonName, opt => opt.MapFrom(s => s.Season.Name))
            .ForMember(d => d.StadiumName, opt => opt.MapFrom(s => s.Stadium.Name));
        CreateMap<Match, GetMatchByIdDto>()
            .ForMember(d => d.SeasonName, opt => opt.MapFrom(s => s.Season.Name))
            .ForMember(d => d.StadiumName, opt => opt.MapFrom(s => s.Stadium.Name));
        CreateMap<Match, CreateMatchDto>().ReverseMap();
        CreateMap<Match, UpdateMatchDto>().ReverseMap();
        CreateMap<Match, ResultMatchWithTeamLogoDto>()
            .ForMember(dest => dest.HomeTeamName, opt => opt.MapFrom(src => src.HomeTeam.Name))
            .ForMember(dest => dest.AwayTeamName, opt => opt.MapFrom(src => src.AwayTeam.Name))
            .ForMember(dest => dest.HomeTeamLogo, opt => opt.MapFrom(src => src.HomeTeam.LogoUrl))
            .ForMember(dest => dest.AwayTeamLogo, opt => opt.MapFrom(src => src.AwayTeam.LogoUrl))
            .ForMember(dest => dest.Stadium, opt => opt.MapFrom(src => src.Stadium.Name));

        // MatchWithTeams
        CreateMap<Match, MatchWithTeamsDto>()
            .ForMember(d => d.SeasonName, opt => opt.MapFrom(s => s.Season.Name))
            .ForMember(d => d.HomeTeamName, opt => opt.MapFrom(s => s.HomeTeam.Name))
            .ForMember(d => d.HomeTeamShortName, opt => opt.MapFrom(s => s.HomeTeam.ShortName))
            .ForMember(d => d.HomeTeamLogo, opt => opt.MapFrom(s => s.HomeTeam.LogoUrl))
            .ForMember(d => d.AwayTeamName, opt => opt.MapFrom(s => s.AwayTeam.Name))
            .ForMember(d => d.AwayTeamShortName, opt => opt.MapFrom(s => s.AwayTeam.ShortName))
            .ForMember(d => d.AwayTeamLogo, opt => opt.MapFrom(s => s.AwayTeam.LogoUrl))
            .ForMember(d => d.StadiumName, opt => opt.MapFrom(s => s.Stadium.Name));

        // MatchEvent
        CreateMap<MatchEvent, ResultMatchEventDto>()
            .ForMember(d => d.TeamName, opt => opt.MapFrom(s => s.Team.Name));
        CreateMap<MatchEvent, GetMatchEventByIdDto>()
            .ForMember(d => d.TeamName, opt => opt.MapFrom(s => s.Team.Name));
        CreateMap<MatchEvent, CreateMatchEventDto>().ReverseMap();
        CreateMap<MatchEvent, UpdateMatchEventDto>().ReverseMap();

        // MatchStatistics
        CreateMap<MatchStatistics, ResultMatchStatisticsDto>().ReverseMap();
        CreateMap<MatchStatistics, CreateMatchStatisticsDto>().ReverseMap();
    }
}