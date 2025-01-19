using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SocialMediaApp.Data.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SocialMediaApp.services
{
    internal class TokenService
    {
        private IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateToken(string userId, string username)
        {

            var jwtSettings = _configuration.GetSection("Jwt");
            var secretKey = jwtSettings["Key"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];
            Console.WriteLine(jwtSettings["ExpiresInMinutes"]);
            var expiration = int.Parse(jwtSettings["ExpiresInMinutes"]);
            // Create claims
            var claims = new[]
            {
                        

            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            // Generate key and credentials
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create JWT token
            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.Now.AddMinutes(expiration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}