using System.Security.Cryptography;

namespace SocialMediaApp.services
{
    public class GenerateRefreshToken
    {
        public static string Generate()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}
