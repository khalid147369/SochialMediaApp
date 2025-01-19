using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data;
using SocialMediaApp.Data.Models;
using SocialMediaApp.DTO;
using SocialMediaApp.Models;
using SocialMediaApp.services;

namespace SocialMediaApp.Controllers
{
    [Route("api/Users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHost;
        public UsersController(UserManager<User> userManager , DbContextApp db, IConfiguration configuration ,IWebHostEnvironment webHost) {

            _userManager = userManager;
            _db = db;
            _configuration = configuration;
            _webHost = webHost;
        }
        [HttpPost("Regester")]
        public async Task<IActionResult> AddUser([FromForm] UserDTO user)
        {
            if (user == null ||user.passWord == null ||user.userName == null||user.email == null)
            {
                return BadRequest("bad request ");
            }

            User us = new User()
            {
                UserName = user.userName,
                Email = user.email,
                avatar = await new ImageHandeler(_webHost).HandleImage(user.avatar,"avatar")
                
            };
           var newuser =  await _userManager.CreateAsync(us, user.passWord);

            if (newuser.Succeeded)
            {
              return Ok("safed succesfully");

            }
            return BadRequest(newuser.Errors);

        }

        [HttpPost("LogIn")]
        public async Task<IActionResult> LogIn( LoginDTO user)
        {
            User us = await _userManager.FindByNameAsync(user.username);

            if (us == null || us.Id ==null || us.UserName ==null)
            {
                return BadRequest("invalid user name or password");
            }
            var isValid = await _userManager.CheckPasswordAsync(us,user.password);
            if (!isValid)
            {
                return BadRequest("invalid user name or password");
            }
            var newtoken = new TokenService(_configuration).GenerateToken(us.Id,us.UserName );
            string reftk = GenerateRefreshToken.Generate();
            us.expires = DateTime.UtcNow.AddDays(5);
            us.refreshToken = reftk;
            await _userManager.UpdateAsync(us);
            

            return Ok(new {token = newtoken,refreshToken =reftk, userName=us.UserName , us.avatar });

        }


    }
}
