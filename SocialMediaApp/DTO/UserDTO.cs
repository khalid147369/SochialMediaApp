namespace SocialMediaApp.Models
{
    public class UserDTO
    {
        public string userName { get; set; }
        public string email { get; set; }
        public string passWord { get; set; }
        public IFormFile? avatar { get; set; }
    }
}
