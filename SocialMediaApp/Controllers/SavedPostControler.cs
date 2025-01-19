using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data.Models;
using SocialMediaApp.Data;
using SocialMediaApp.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.Extensions.Hosting;

namespace SocialMediaApp.Controllers
{
    [Route("api/SavedPosts")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class SavedPostControler : ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IWebHostEnvironment _environment;

        public SavedPostControler(UserManager<User> userManager, DbContextApp db, IWebHostEnvironment environment)
        {

            _userManager = userManager;
            _db = db;
            _environment = environment;
        }

     

        
        [HttpPost("{PostId}")]
        public async Task<IActionResult> SavePost(int PostId)
        {
            string usId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (usId == null)
            {
                return BadRequest();
            }
            var PostToSave = await _db.posts.FirstOrDefaultAsync((p) => p.Id == PostId);
            if (PostToSave == null)
            {
                return BadRequest("Post to save not found");
            }

            var pt = new SavedPosts();

            pt.UserId = usId;
            pt.PostId = PostId;
            pt.Post = PostToSave;
            pt.SavedAt = DateTime.UtcNow;



            await _db.savedPosts.AddAsync(pt);
            await _db.SaveChangesAsync();
            return Ok(PostToSave);
        }
        [HttpDelete("{PostId}")]
        public async Task<IActionResult> DeleteSavedPost(int PostId)
        {
            string usId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

              Console.WriteLine($"userId : {usId}" );
                Console.WriteLine(PostId);
            if (usId == null)
            {
                return BadRequest("invalid user");
            }

            var PostSavedToDelete = await _db.savedPosts.FirstOrDefaultAsync((p) => p.PostId == PostId && p.UserId ==usId );
            
            if (PostSavedToDelete == null)
                        {
                            return BadRequest("Post to delete not found");
                        }

            _db.savedPosts.Remove(PostSavedToDelete);
            await _db.SaveChangesAsync();
            return Ok("deleted succesfuly");
        }
        [HttpGet]
        public async Task<IActionResult> GetSavedPost()
        {
            string usId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (usId == null)
            {
                return BadRequest("invalid user");
            }



            Console.WriteLine($"user :  {usId}");

            var SavedP = await _db.savedPosts.Where((p)=>p.UserId==usId).Include(sp => sp.Post) // Eager load the related Post data
            .ToListAsync() ;
            if (SavedP == null)
            {
                return BadRequest("Saved Post is empty");
                }
             List<Post> posts = SavedP.Select(p => p.Post).ToList();
            return Ok(posts);
        }



    }
}
