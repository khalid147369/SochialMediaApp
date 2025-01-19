using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data.Models;
using SocialMediaApp.Data;
using SocialMediaApp.DTO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SocialMediaApp.services;

namespace SocialMediaApp.Controllers
{
    [Route("api/refreshToken")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

    public class RefreshTokenControler : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IConfiguration _configuration;

        public RefreshTokenControler(UserManager<User> userManager, DbContextApp db, IConfiguration configuration) {
            _userManager = userManager;
            _db = db;
            _configuration = configuration;
        }
        [HttpPost]
        public async Task<IActionResult> refreshToken(RefreshTokenDTO refreshToken)
        {
            string usId =  User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine(usId);
            if (usId == null) {
                return BadRequest("invalid id");
            }
            var user = await _userManager.FindByIdAsync(usId);
            if (user == null) 
            {
                return BadRequest("invalid user");
            }
            if (user.refreshToken != refreshToken.refreshToken)
            {
                return BadRequest("invalid refreshToken");
            }
            if (user.expires < DateTime.UtcNow)
            {
                return BadRequest("expired refreshToken");
            }
            string tk = new TokenService(_configuration).GenerateToken(usId, user.UserName);
            return Ok(new {token = tk,user =user});
        }
    }
}
