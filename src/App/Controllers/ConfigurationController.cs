using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Partie.Web.App.Controllers
{
    [Produces("application/json")]
    [Route("api/Configuration")]
    public class ConfigurationController : Controller
    {
        private readonly IConfiguration _configuration;

        public ConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("[action]")]
        public IActionResult ConfigurationData()
        {
            return Ok(new Dictionary<string, string>
            {
                {"applicationUrl", _configuration["WebAppUrl"]},
                {"authServerUrl", _configuration["Auth:AuthServerUrl"]},
                {"gatewayApiUrl", _configuration["GatewayApiUrl"]},
                {"ageLimit", _configuration["AgeLimit"]},
                {"captchaSiteKey",_configuration["Recaptcha:SiteKey"]},
                {"cdnBaseUrl",_configuration["CdnBaseUrl"]},
                {"chatApiUrl",_configuration["ChatApiUrl"]},
                {"commApiUrl",_configuration["CommApiUrl"]}
            });
        }
    }
}
