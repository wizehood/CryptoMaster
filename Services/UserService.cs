using Okta.Sdk;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using CryptoMaster.Models;

namespace CryptoMaster.Services
{
    public class UserService : IUserService
    {
        private readonly IOktaClient _oktaClient;

        public UserService(IOktaClient oktaClient)
        {
            _oktaClient = oktaClient;
        }

        public async Task<HttpResponseMessage> CreateUser(UserModel user)
        {
            var responseMessage = new HttpResponseMessage();
            try
            {
                //Map to Okta model
                var oktaUser = new UserOktaModel()
                {
                    Profile = new Profile()
                    {
                         FirstName = user.FirstName,
                         LastName = user.LastName,
                         Email = user.UserName,
                         Login = user.UserName
                    },
                    Credentials = new Credentials()
                    {
                        Password = new Password()
                        {
                            Value = user.Password
                        }
                    }
                };

                await _oktaClient.PostAsync($"{ _oktaClient.Configuration.OrgUrl}/api/v1/users?activate=true", oktaUser);
                responseMessage.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                responseMessage.StatusCode = HttpStatusCode.InternalServerError;
                responseMessage.ReasonPhrase = string.Format($"{ex.Message}");
            }
            return responseMessage;
        }
    }
}
