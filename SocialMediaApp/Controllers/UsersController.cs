using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;
using SocialMediaApp.Data.Models;
using SocialMediaApp.DTO;
using SocialMediaApp.Models;
using SocialMediaApp.services;
using System.Security.Claims;

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
            Response.Cookies.Append("refreshToken", reftk, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use HTTPS
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new {token = newtoken, userName=us.UserName , avatar =us.avatar,email=us.Email });

        }
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

        [HttpGet]
        public async Task<IActionResult> GetuserById()
        {
            string usId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        User user =await _userManager.Users.FirstOrDefaultAsync((us)=>us.Id == usId);
            if (user == null)
            { return BadRequest("user notfound"); }
            return Ok(new { username = user.UserName, email=user.Email,avatar=user.avatar,userId=user.Id });

        }
        [HttpPut]
        public async Task<IActionResult> updateUserData(UpdateUserDataDTO userNewData)
        {

           User? user =await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return BadRequest("user not found");
            }
          
            if (userNewData.avatar != null && userNewData.avatar.Length > 0)
            {
                user.avatar = await new ImageHandeler(_webHost).HandleImage(userNewData.avatar, "avatar");
            }
            if (!string.IsNullOrEmpty(userNewData.username))
            {
                user.UserName = userNewData.username;
            }
            if (!string.IsNullOrEmpty(userNewData.email))
            {
                user.Email = userNewData.email;
            }
            if (!string.IsNullOrEmpty(userNewData.oldPassword) && !string.IsNullOrEmpty(userNewData.newPassword))
            {


                var isCurrentPasswordValid = await _userManager.CheckPasswordAsync(user, userNewData.oldPassword);
                if (!isCurrentPasswordValid)
                {
                    return BadRequest("Current password is incorrect.");
                }

                var result = await _userManager.ChangePasswordAsync(user, userNewData.oldPassword, userNewData.newPassword);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

            
        }
            var isSucceeded =await _userManager.UpdateAsync(user);
            if (!isSucceeded.Succeeded)
            {
                return StatusCode(500, "user does not update");
            }
            return Ok("updated successfully");
        }

    }
}
