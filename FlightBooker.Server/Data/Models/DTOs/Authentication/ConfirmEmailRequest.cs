using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs
{
    public class ConfirmEmailRequest
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string ConfirmationToken { get; set; }
    }
}
