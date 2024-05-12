namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class RouteCreateDTO
    {
        public int AirlineId { get; set; }
        public bool IsTransit { get; set; }
        public bool Repeating { get; set; }
        public string? Frequency { get; set; } = null;
        public ICollection<FlightCreateDTO> Flights { get; set; } = [];
        public Dictionary<int, decimal> Prices { get; set; } = [];

    }
}
