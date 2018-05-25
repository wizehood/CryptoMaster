using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CryptoMaster.Models;
using CryptoMaster.Services;

namespace CryptoMaster.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // POST /api/user/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody]UserModel user)
        {
            if (string.IsNullOrEmpty(user?.FirstName)
                || string.IsNullOrEmpty(user?.LastName)
                || string.IsNullOrEmpty(user?.UserName)
                || string.IsNullOrEmpty(user?.Password))
            {
                return BadRequest();
            }

            var response = await _userService.CreateUser(user);
            if (!response.IsSuccessStatusCode)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
