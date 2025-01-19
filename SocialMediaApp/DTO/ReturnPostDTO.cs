namespace SocialMediaApp.DTO
{
    public class ReturnPostDTO
    {
        public int id { get; set; }
        public string? avatar { get; set; }
        public string description { get; set; }
        public int commentsLenght { get; set; }
        public string? imagePost { get; set; }
        public int? likes { get; set; }
        public DateTime publicatedAt { get; set; }
        public string title { get; set; }
        public string userId { get; set; }


    }
}
