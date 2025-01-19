namespace SocialMediaApp.Data.Models
{
    public class SavedPosts
    {
        public int Id { get; set; } // Primary key
        public string UserId { get; set; } // User's ID (FK from AspNetUsers)
        public int PostId { get; set; } // Post's ID (FK from Posts table)
        public Post Post { get; set; }
        public DateTime SavedAt { get; set; } = DateTime.UtcNow; // Timestamp
    }
}
