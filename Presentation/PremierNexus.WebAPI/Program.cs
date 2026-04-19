using Microsoft.EntityFrameworkCore;
using PremierNexus.Business.Abstract;
using PremierNexus.Business.Concrete;
using PremierNexus.Business.Mapping;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DataAccess.Concrete;
using PremierNexus.DataAccess.EntityFramework;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// DbContext Configuration
builder.Services.AddDbContext<PremierNexusContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("PremierNexusPolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Repository Registrations (DAL)
builder.Services.AddScoped<ILeagueDal, EfLeagueDal>();
builder.Services.AddScoped<ISeasonDal, EfSeasonDal>();
builder.Services.AddScoped<IStadiumDal, EfStadiumDal>();
builder.Services.AddScoped<ITeamDal, EfTeamDal>();
builder.Services.AddScoped<IMatchDal, EfMatchDal>();
builder.Services.AddScoped<IMatchEventDal, EfMatchEventDal>();
builder.Services.AddScoped<IMatchStatisticsDal, EfMatchStatisticsDal>();

// Service Registrations (Business)
builder.Services.AddScoped<ILeagueService, LeagueManager>();
builder.Services.AddScoped<ISeasonService, SeasonManager>();
builder.Services.AddScoped<IStadiumService, StadiumManager>();
builder.Services.AddScoped<ITeamService, TeamManager>();
builder.Services.AddScoped<IMatchService, MatchManager>();
builder.Services.AddScoped<IMatchEventService, MatchEventManager>();
builder.Services.AddScoped<IMatchStatisticsService, MatchStatisticsManager>();
builder.Services.AddScoped<IStandingService, StandingManager>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS Middleware
app.UseCors("PremierNexusPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();