using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs
{
    public class LogInRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        public bool RememberMe { get; set; }
    }
}
