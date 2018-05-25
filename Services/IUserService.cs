using System.Net.Http;
using System.Threading.Tasks;
using CryptoMaster.Models;

namespace CryptoMaster.Services
{
    public interface IUserService
    {
        Task<HttpResponseMessage> CreateUser(UserModel user);
    }
}
