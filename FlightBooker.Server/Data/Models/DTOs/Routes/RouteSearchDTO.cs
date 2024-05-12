namespace FlightBooker.Server.Data.Models.DTOs.Routes
{
    public class RouteSearchDTO
    {
        public string DepartureAirportCode { get; set; } = null!;
        public string ArrivalAirportCode { get; set; } = null!;
        public DateTime DepartureDate { get; set; }
        public bool IsRoundTrip { get; set; } = false;
        public DateTime? ReturnDate { get; set; } = null;
        public int Seats { get; set; }
        public bool DirectFlightsOnly { get; set; } = false;
        public int? CabinClass { get; set; }
    }
}
