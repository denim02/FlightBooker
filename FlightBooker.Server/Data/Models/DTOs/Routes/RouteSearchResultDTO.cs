namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class RouteSearchResultDTO
    {
        public int Id { get; set; }
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Duration { get; set; }
        public decimal PricePerSeat { get; set; }
        public string AirlineName { get; set; } = null!;
        public int Stops { get; set; }
        public int AvailableSeats { get; set; }
        public ICollection<FlightSearchResultDTO> Flights { get; set; } = [];
    }
}
