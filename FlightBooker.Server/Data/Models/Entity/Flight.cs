using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public class Flight
    {
        public int FlightId { get; set; }
        public int AirplaneId { get; set; }
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public TimeSpan Duration
        {
            get
            {
                return (ArrivalTime - DepartureTime);
            }
        }
        public TimeSpan? Delay { get; set; } = null;
        public int RouteId { get; set; }

        // Foreign Keys and properties to access related entities
        public Airplane Airplane { get; set; } = null!;

        [ForeignKey("DepartureAirportCode")]
        public Airport DepartureAirport { get; set; } = null!;

        [ForeignKey("ArrivalAirportCode")]
        public Airport ArrivalAirport { get; set; } = null!;

        [ForeignKey("RouteId")]
        public Route Route { get; set; } = null!;

        public ICollection<FlightSeat> FlightSeats { get; set; } = new List<FlightSeat>();


        public ICollection<FlightSeat> GenerateFlightSeats(Airplane airplane)
        {
            return airplane.AirplaneSeats.Select(seat => new FlightSeat
            {
                FlightId = this.FlightId,
                AirplaneSeatId = seat.AirplaneSeatId,
            }).ToList();
        }
    }
}
