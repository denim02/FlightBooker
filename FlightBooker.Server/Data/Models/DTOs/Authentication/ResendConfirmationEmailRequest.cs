using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs
{
    public class ResendConfirmationEmailRequest
    {
        [Required]
        public string UserId { get; set; }
    }
}
