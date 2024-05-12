using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public enum RouteFrequency { Daily, Weekly, Monthly, Yearly }

    public class Route
    {
        public int RouteId { get; set; }

        public int AirlineId { get; set; }

        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string DepartureAirportCode { get; set; } = null!;

        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string ArrivalAirportCode { get; set; } = null!;

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        public bool IsRepeating { get; set; } = false;

        public RouteFrequency? Frequency { get; set; } = null;

        public int RouteGroupId { get; set; }

        // Foreign Keys and properties to access related entities
        public Airline Airline { get; set; } = null!;

        public ICollection<RouteSeatClass> RouteSeatClasses { get; set; } = new List<RouteSeatClass>();

        [ForeignKey(nameof(DepartureAirportCode))]
        public Airport DepartureAirport { get; set; } = null!;

        [ForeignKey(nameof(ArrivalAirportCode))]
        public Airport ArrivalAirport { get; set; } = null!;

        public ICollection<Flight> Flights { get; set; } = new List<Flight>();

        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
