namespace SocialMediaApp.Data.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string avatar { get; set; }
        public DateTime Created { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; } // Navigation property

    }
}
