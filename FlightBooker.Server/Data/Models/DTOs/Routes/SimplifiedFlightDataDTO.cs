namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class SimplifiedFlightDataDTO
    {
        public int Id { get; set; }
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public TimeSpan Duration { get; set; }
        public TimeSpan? Delay { get; set; } = null;
        public string AirplaneName { get; set; } = null!;
        public int RouteId { get; set; }
    }
}
