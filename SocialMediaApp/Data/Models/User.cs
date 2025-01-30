using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SocialMediaApp.Data.Models
{
    public class User:IdentityUser
    {
        public string? avatar {  get; set; }
        [MaxLength(1024)]
        public string refreshToken { get; set; }
        public DateTime expires { get; set; }
        public ICollection<Post>? Posts { get; set; }
    }
}
