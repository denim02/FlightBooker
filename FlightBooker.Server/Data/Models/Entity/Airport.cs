using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class Airport
    {
        [Key]
        [StringLength(3, MinimumLength = 3)]
        public string AirportCode { get; set; } = null!;

        [Required]
        public string AirportName { get; set; } = null!;

        [Required]
        public string City { get; set; } = null!;

        [Required]
        public string Country { get; set; } = null!;
    }
}
