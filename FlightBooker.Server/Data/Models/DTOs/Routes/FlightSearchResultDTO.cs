namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class FlightSearchResultDTO
    {
        public int Id { get; set; }
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Duration { get; set; }
        public int? Delay { get; set; } = null;
    }
}
