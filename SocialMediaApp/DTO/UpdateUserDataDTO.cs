namespace SocialMediaApp.DTO
{
    public class UpdateUserDataDTO
    {
        public string? username { get; set; }
        public IFormFile? avatar { get; set; }
        public string? email { get; set; }
        public string? oldPassword { get; set; }
        public string? newPassword { get; set; }
    }
}
