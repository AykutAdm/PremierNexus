using PremierNexus.Entities.Concrete;

namespace PremierNexus.DataAccess.Abstract;

public interface ILeagueDal : IGenericDal<League>
{
    Task<List<League>> GetListWithNavigationsAsync();
    Task<League> GetByIdWithNavigationsAsync(int id);
}