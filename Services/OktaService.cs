using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Okta.Sdk;
using CryptoMaster.Models;

namespace CryptoMaster.Services
{
    public class OktaService : IOktaService
    {
        private const string ProfileCustomKey = "calculation";

        private readonly IOktaClient _oktaClient;

        public OktaService(IOktaClient oktaClient)
        {
            _oktaClient = oktaClient;
        }

        public async Task SaveCalculation(CalculationModel calculation, string userId)
        {
            var user = await _oktaClient.Users.GetUserAsync(userId);

            var json = JsonConvert.SerializeObject(calculation);

            user.Profile[ProfileCustomKey] = json;
            await user.UpdateAsync();
        }

        public async Task<CalculationModel> GetCalculation(string userId)
        {
            try
            {
                var user = await _oktaClient.Users.GetUserAsync(userId);

                if (user == null)
                {
                    return new CalculationModel();
                }

                var json = user.Profile.GetProperty<string>(ProfileCustomKey);
                if (string.IsNullOrEmpty(json))
                {
                    return new CalculationModel();
                }

                return JsonConvert.DeserializeObject<CalculationModel>(json);
            }
            catch
            {
                return new CalculationModel();
            }


        }
    }
}
