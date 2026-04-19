using AutoMapper;
using PremierNexus.Business.Abstract;
using PremierNexus.DataAccess.Abstract;
using PremierNexus.DTOs.StadiumDtos;
using PremierNexus.Entities.Concrete;

namespace PremierNexus.Business.Concrete;

public class StadiumManager : IStadiumService
{
    private readonly IStadiumDal _stadiumDal;
    private readonly IMapper _mapper;

    public StadiumManager(IStadiumDal stadiumDal, IMapper mapper)
    {
        _stadiumDal = stadiumDal;
        _mapper = mapper;
    }

    public async Task<List<ResultStadiumDto>> TGetListAsync()
    {
        var values = await _stadiumDal.GetListAsync();
        return _mapper.Map<List<ResultStadiumDto>>(values);
    }

    public async Task<ResultStadiumDto> TGetByIdAsync(int id)
    {
        var value = await _stadiumDal.GetByIdAsync(id);
        return _mapper.Map<ResultStadiumDto>(value);
    }

    public async Task TInsertAsync(CreateStadiumDto dto)
    {
        var value = _mapper.Map<Stadium>(dto);
        await _stadiumDal.InsertAsync(value);
    }

    public async Task TUpdateAsync(UpdateStadiumDto dto)
    {
        var value = _mapper.Map<Stadium>(dto);
        await _stadiumDal.UpdateAsync(value);
    }

    public async Task TDeleteAsync(int id)
    {
        await _stadiumDal.DeleteAsync(id);
    }

    public async Task<List<ResultStadiumDto>> TGetStadiumsByCityAsync(string city)
    {
        var values = await _stadiumDal.GetStadiumsByCityAsync(city);
        return _mapper.Map<List<ResultStadiumDto>>(values);
    }
}