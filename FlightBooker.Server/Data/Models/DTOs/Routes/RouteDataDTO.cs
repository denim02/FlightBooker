namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class RouteDataDTO
    {
        public int Id { get; set; }
        public int AirlineId { get; set; }
        public bool IsTransit { get; set; }
        public bool Repeating { get; set; }
        public string? Frequency { get; set; } = null;
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public bool HasReservations { get; set; } = false;
        public int FlightCount { get; set; } = 1;
        public Dictionary<string, decimal> Prices { get; set; } = [];
        public int RouteGroupId { get; set; }

    }
}
