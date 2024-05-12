namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class RouteBookingDataDTO
    {
        public int Id { get; set; }
        public string AirlineName { get; set; } = null!;
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public ICollection<FlightBookingDataDTO> Flights { get; set; } = [];
        public Dictionary<string, decimal> Prices { get; set; } = [];
    }

    public class FlightBookingDataDTO
    {
        public int FlightId { get; set; }
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Duration { get; set; }
        public int? Delay { get; set; } = null;
        public int AirplaneId { get; set; }
        public ICollection<FlightSeatDataDTO> Seats { get; set; } = [];
    }

    public class FlightSeatDataDTO
    {
        public int FlightSeatId { get; set; }
        public int AirplaneSeatId { get; set; }
        public bool IsReserved { get; set; } = false;
    }
}
