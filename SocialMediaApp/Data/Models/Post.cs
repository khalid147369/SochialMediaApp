using System.Text.Json.Serialization;

namespace SocialMediaApp.Data.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? imagePost { get; set; }
        public string UserId { get; set; }
        public string? avatar { get; set; }
        public int? likes { get; set; }
        public DateTime publicatedAt { get; set; }
        public ICollection<Comment> comments { get; set; }
        public int commentsLenght { get; set; } = 0;
        [JsonIgnore]
        public User user { get; set; }

        
    }
}
