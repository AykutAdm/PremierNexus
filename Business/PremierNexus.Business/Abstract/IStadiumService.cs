using PremierNexus.DTOs.StadiumDtos;

namespace PremierNexus.Business.Abstract;

public interface IStadiumService
{
    Task<List<ResultStadiumDto>> TGetListAsync();
    Task<ResultStadiumDto> TGetByIdAsync(int id);
    Task TInsertAsync(CreateStadiumDto dto);
    Task TUpdateAsync(UpdateStadiumDto dto);
    Task TDeleteAsync(int id);
    Task<List<ResultStadiumDto>> TGetStadiumsByCityAsync(string city);
}