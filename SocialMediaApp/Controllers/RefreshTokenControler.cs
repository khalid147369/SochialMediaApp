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
using System.Net;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;

namespace SocialMediaApp.Controllers
{
    [Route("api/refreshToken")]
    [EnableCors("AllowSpecificOrigin")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RefreshTokenControler : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IConfiguration _configuration;
        private readonly ILogger<RefreshTokenControler> _logger;

        public RefreshTokenControler(UserManager<User> userManager, DbContextApp db, IConfiguration configuration, ILogger<RefreshTokenControler> logger)
        {
            _userManager = userManager;
            _db = db;
            _configuration = configuration;
            _logger = logger;
        }
        private static bool _isRefreshing = false; // Add this flag

        [HttpPost]
        public async Task<IActionResult> RefreshToken()
        {
            // 1. Extract refresh token from cookies
            if (_isRefreshing)
            {
                return BadRequest("Refresh already in progress");
            }

            _isRefreshing = true;
            try
            {
                // Existing code here...
            }
            finally
            {
                _isRefreshing = false;
            }
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return BadRequest("Refresh token not found");
            }
     



           
            // 2. Find user by refresh token
            User? user = await _userManager.Users
                .FirstOrDefaultAsync(u => u.refreshToken == refreshToken);

            if (user == null)
            {
                Response.Cookies.Delete("refreshToken");
                return BadRequest("Invalid refresh token");
            }
            // After updating the user:
            Console.WriteLine($"Database Token: {user.refreshToken}");
            // 3. Validate token expiration
            if (user.expires < DateTime.UtcNow)
            {
                Response.Cookies.Delete("refreshToken");
                return BadRequest("Expired refresh token");
            }

            // 4. Validate required user properties
            if (string.IsNullOrEmpty(user.UserName))
            {
                return BadRequest("Invalid user data");
            }
            // 5. Generate new tokens
                  var newRefreshToken = GenerateRefreshToken.Generate();
                var newToken = new TokenService(_configuration).GenerateToken(user.Id, user.UserName);
            // After generating the new token:
            Console.WriteLine($"Generated Token: {newRefreshToken}");



            // 6. Update user record FIRST
            user.refreshToken = newRefreshToken;
                user.expires = DateTime.UtcNow.AddDays(5); // Align expiration with cookie

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                // Handle concurrency errors explicitly
                if (updateResult.Errors.Any(e => e.Code == "ConcurrencyFailure"))
                {
                    return BadRequest("Token already used. Please re-authenticate  ");
                }
                return StatusCode(500, "Failed to update user");
            }
            Console.WriteLine($"Post-Update Token: {user.refreshToken}");

            // 7. Set new cookie ONLY after successful update
            Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = user.expires // Align cookie expiration with user's refresh token
                });
            // After setting the cookie:
            Console.WriteLine($"Cookie Token: {newRefreshToken}");
            return Ok(new { token = newToken, userName = user.UserName, avatar = user.avatar, email = user.Email });
            
           
        }
    }
}
