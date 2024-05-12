using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class FlightCreateDTO
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z]{3}$", ErrorMessage = "An airport code must contain 3 letters.")]
        public string DepartureAirportCode { get; set; } = null!;

        [Required]
        [RegularExpression(@"^[a-zA-Z]{3}$", ErrorMessage = "An airport code must contain 3 letters.")]
        public string ArrivalAirportCode { get; set; } = null!;

        public DateTime DepartureTime { get; set; }

        public DateTime ArrivalTime { get; set; }

        public int AirplaneId { get; set; }
    }
}
