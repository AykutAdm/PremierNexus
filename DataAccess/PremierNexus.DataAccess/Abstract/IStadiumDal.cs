using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface IStadiumDal : IGenericDal<Stadium>
{
    Task<List<Stadium>> GetListWithNavigationsAsync();
    Task<Stadium> GetByIdWithNavigationsAsync(int id);
    Task<List<Stadium>> GetStadiumsByCityAsync(string city);
}