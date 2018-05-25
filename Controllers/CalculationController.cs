using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using CryptoMaster.Models;
using CryptoMaster.Services;

namespace CryptoMaster.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class CalculationController : Controller
    {
        private readonly IOktaService _calculationService;

        public CalculationController(IOktaService calculationService)
        {
            _calculationService = calculationService;
        }

        [HttpPost]
        public async Task<IActionResult> SaveCalculation([FromBody]CalculationModel calculation)
        {
            if (calculation == null)
            {
                return BadRequest();
            }

            var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
            }

            try
            {
                await _calculationService.SaveCalculation(calculation, userId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetCalculation()
        {
            var userId = User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest();
            }

            var calculation = await _calculationService.GetCalculation(userId);

            return Ok(calculation);
        }
    }
}
