using SocialMediaApp.Data.Models;

namespace SocialMediaApp.services
{
    public class ImageHandeler
    {
        private IWebHostEnvironment _environment;
        private IFormFile _image { get; set; }
        public ImageHandeler(IWebHostEnvironment environment) 
        {
           _environment = environment;
        }
        
        public async Task<string?>  HandleImage(IFormFile image ,string role="none")
        {
            

            if (image == null || image.Length == 0)
            {
                
                Console.WriteLine("============image not found============");
                return null;
            }

           
           switch (role)
            {
                case "avatar":
                    // Ensure uploads directory exists

                    var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads/avatars");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    // Generate a unique file name to avoid overwriting
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var filePath = Path.Combine(uploadsPath, fileName);

                    // Save the file to the server
                    using (var fileStream = new FileStream(filePath, FileMode.OpenOrCreate))
                    {
                        await image.CopyToAsync(fileStream);
                    }
                    return $"/uploads/avatars/{fileName}";
                default:
                    // Ensure uploads directory exists

                    var upldPath = Path.Combine(_environment.WebRootPath, "uploads");
                    if (!Directory.Exists(upldPath))
                    {
                        Directory.CreateDirectory(upldPath);
                    }

                    // Generate a unique file name to avoid overwriting
                    var fN = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var flPath = Path.Combine(upldPath, fN);

                    // Save the file to the server
                    using (var fileStream = new FileStream(flPath, FileMode.OpenOrCreate))
                    {
                        await image.CopyToAsync(fileStream);
                    }
                    return $"/uploads/{fN}";
            }
        }

        
    }
}
