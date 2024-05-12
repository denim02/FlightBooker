namespace FlightBooker.Server.Data.Models.DTOs.Reservations
{
    public class ReservationCreateDTO
    {
        public string ClientId { get; set; } = null!;
        public int RouteId { get; set; }
        public ICollection<FlightSeatCreateDTO> FlightSeats { get; set; } = [];
    }

    public class FlightSeatCreateDTO
    {
        public int FlightId { get; set; }
        public int[] AirplaneSeatIds { get; set; } = [];
    }
}
