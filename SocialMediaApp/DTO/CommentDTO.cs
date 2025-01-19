namespace SocialMediaApp.DTO
{
    public class CommentDTO
    {
        
        public string Title { get; set; }
        public string Content { get; set; }
        public string? avatar { get; set; }
        public int PostId { get; set; }
    }
}
