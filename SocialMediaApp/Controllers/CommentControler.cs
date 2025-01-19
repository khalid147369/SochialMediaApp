using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data.Models;
using SocialMediaApp.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using SocialMediaApp.DTO;
using Microsoft.EntityFrameworkCore;

namespace SocialMediaApp.Controllers
{
    [Route("api/comments")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CommentControler : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DbContextApp _db;
        private readonly IWebHostEnvironment _environment;

        public CommentControler(UserManager<User> userManager, DbContextApp db, IWebHostEnvironment environment)
        {

            _userManager = userManager;
            _db = db;
            _environment = environment;
        }

        [HttpPost]
        public async Task<IActionResult> SendComment(CommentDTO comment)
        {

            if (comment.Content == null || comment.Title == null || comment.PostId == null  )
            {
                return BadRequest("all fealds must be filled");
            }
            if ( comment.avatar == null)
            {
                comment.avatar = "";
            }

            Comment cmnt = new Comment();
            cmnt.Content = comment.Content;
            cmnt.Title = comment.Title;
            cmnt.PostId = comment.PostId;
            if (comment.avatar != null)
            {
              cmnt.avatar = comment.avatar;
            }
           
           
            cmnt.Created = DateTime.UtcNow;
            await _db.comments.AddAsync(cmnt);
             
            await _db.SaveChangesAsync();
            
            return Ok(cmnt);

        }
        [HttpGet("{postId}")]
        public  IActionResult getPostComment(int postId)
        {
            var posts =  _db.comments.Where(cm=>cm.PostId == postId);
            return Ok(posts);
        }

    }
}
