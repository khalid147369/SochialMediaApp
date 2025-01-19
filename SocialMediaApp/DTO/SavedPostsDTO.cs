namespace SocialMediaApp.DTO
{
    public class SavedPostsDTO
    {
        public string UserId { get; set; } // User's ID (FK from AspNetUsers)
        public int PostId { get; set; }
    }
}
