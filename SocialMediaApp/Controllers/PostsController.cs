using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using SocialMediaApp.Data;
using SocialMediaApp.Data.Models;
using SocialMediaApp.DTO;
using SocialMediaApp.Models;
using SocialMediaApp.services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SocialMediaApp.Controllers
{
    [Route("api/Posts")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IWebHostEnvironment _environment;

        public PostsController(UserManager<User> userManager, DbContextApp db, IWebHostEnvironment environment) {

            _userManager = userManager;
            _db = db;
            _environment = environment;
        }
        [HttpGet]
        public async Task<IActionResult> getAllPosts()
        {
            var posts = await _db.posts.Select((post)=> new ReturnPostDTO()
            {
                id = post.Id,
                userId = post.UserId,
                imagePost = post.imagePost,
                avatar = post.avatar,
                title = post.Title,
                description = post.Description,
                commentsLenght = post.comments.Count(),
                likes=post.likes,
                publicatedAt = post.publicatedAt,


            }) .ToListAsync();
            return Ok(posts);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("userPosts")]
        public async Task<IActionResult> getUserPosts()
        {
            string usID = User.Claims.FirstOrDefault((cl) => cl.Type == ClaimTypes.NameIdentifier)?.Value;
            var posts = await _db.posts.Where(p=>p.UserId==usID).ToListAsync();
            return Ok(posts);
        }

        [HttpPost]
        public async Task<IActionResult> AddPost([FromForm] PostDTO post)
        {

            string usId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            string username = User.FindFirst(ClaimTypes.Name)?.Value;



            if (usId == null)
            {
                return BadRequest("invalid userid");
            }
            if (username == null)
            {
                return BadRequest("invalid username");
            }
            var user = await _userManager.FindByIdAsync(usId);
            if (user == null)
            {
                return BadRequest("invalid user");
            }

            var pt = new Post();


            pt.Title = username;
            pt.Description = post.Description;
            pt.UserId = usId;
            pt.user = user;
            pt.imagePost = await new ImageHandeler(_environment).HandleImage(post.imagePost);
            pt.avatar = user.avatar;
            pt.publicatedAt = DateTime.Now;


            await _db.AddAsync(pt);
            await _db.SaveChangesAsync();
            return Ok(pt);
        }

        [HttpPut("like/{postId}")]
        public async Task<IActionResult> LikePost(int postId)
        {

            var pt = await _db.posts.FirstOrDefaultAsync((p) => p.Id==postId);
            if (pt==null)
            {
                return BadRequest("post Not found");
            }
            
            pt.likes = pt.likes + 1;
            if (pt.likes == null)
            {
                pt.likes = 1;
            } 
           

             _db.posts.Update(pt);
            await _db.SaveChangesAsync();
            return Ok(new {newLikes = pt.likes,isLiked=true});
        }
        [HttpPut("unlike/{postId}")]

        public async Task<IActionResult> unLikePost(int postId)
        {

            var pt = await _db.posts.FirstOrDefaultAsync((p) => p.Id==postId);
            if (pt==null)
            {
                return BadRequest("post Not found");
            }
            
            pt.likes = pt.likes - 1;
            if (pt.likes == null)
            {
                return Ok(new { newLikes = pt.likes });
            }


            _db.posts.Update(pt);
            await _db.SaveChangesAsync();
            return Ok(new {newLikes = pt.likes ,isLiked =false});
        }
        [HttpDelete("{postId}")]
        public async Task<IActionResult> deletePostById(int postId)
        {
            var post = await _db.posts.FindAsync(postId);
            if (post == null)
            {
                return NotFound("Post not found");
            }
            // Delete the image file if it exists
            if (!string.IsNullOrEmpty(post.imagePost))
            {
                Console.WriteLine($"======PostImage=======>{post.imagePost}");
                var imagePath = Path.Combine(_environment.WebRootPath, post.imagePost.TrimStart('/'));
                Console.WriteLine($"======imagePath=======>{post.imagePost}");

                if (System.IO.File.Exists(imagePath))
                {
                    try
                    {
                        System.IO.File.Delete(imagePath);
                        Console.WriteLine("Image deleted successfully");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error deleting image: {ex.Message}");
                    }
                }
            }
            _db.posts.Remove(post);
            await _db.SaveChangesAsync();
            return Ok("Post deleted successfully");
        }


    }
}
