using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class Airline
    {
        public int AirlineId { get; set; }

        [Required]
        public string AirlineName { get; set; } = null!;

        [Required]
        public string PhoneNumber { get; set; } = null!;

        [Required]
        public string EmailAddress { get; set; } = null!;

        [Required]
        public string Country { get; set; } = null!;

        public ICollection<AirlineOperator>? Operators { get; set; } = new List<AirlineOperator>();
        public ICollection<Route>? Routes { get; set; } = new List<Route>();
    }
}
