using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs
{
    public class SignUpRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string LastName { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$", ErrorMessage = "The password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.")]
        public string Password { get; set; }

        [Required]
        [StringLength(13)]
        [RegularExpression(@"\+\d{12}", ErrorMessage = "The correct format for a phone number starts with a + sign and the country prefix followed by 9 digits (e.g. +359876220321).")]
        public string PhoneNumber { get; set; }
    }
}
