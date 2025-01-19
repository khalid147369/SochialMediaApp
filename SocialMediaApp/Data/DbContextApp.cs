using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data.Models;
using System.Data;
namespace SocialMediaApp.Data
{
    public class DbContextApp: IdentityDbContext<IdentityUser>
    {

        public DbContextApp( DbContextOptions<DbContextApp> options):base(options) {
          
        }
        public DbSet<Post> posts { get; set; }
        public DbSet<SavedPosts> savedPosts { get; set; }
        public DbSet<Comment> comments { get; set; }
    }
}
