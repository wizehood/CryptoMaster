using CryptoMaster.Models;
using System.Threading.Tasks;

namespace CryptoMaster.Services
{
    public interface IOktaService
    {
        Task<CalculationModel> GetCalculation(string userId);

        Task SaveCalculation(CalculationModel calculation, string userId);
    }
}
