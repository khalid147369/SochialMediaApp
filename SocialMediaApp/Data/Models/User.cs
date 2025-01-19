using Microsoft.AspNetCore.Identity;

namespace SocialMediaApp.Data.Models
{
    public class User:IdentityUser
    {
        public string? avatar {  get; set; }
        public string refreshToken { get; set; }
        public DateTime expires { get; set; }
        public ICollection<Post>? Posts { get; set; }
    }
}
