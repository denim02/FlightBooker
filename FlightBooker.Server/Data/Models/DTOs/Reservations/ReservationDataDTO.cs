namespace FlightBooker.Server.Data.Models.DTOs.Reservations
{
    public class ReservationDataDTO
    {
        public int Id { get; set; }
        public string ClientId { get; set; } = null!;
        public int RouteId { get; set; }
        public DateTime ReservationDate { get; set; }
        public ReservationSeatDataDTO[] ReservationSeatsData { get; set; } = [];
    }

    public class ReservationSeatDataDTO
    {
        public int FlightId { get; set; }
        public int AirplaneId { get; set; }
        public IEnumerable<string> ReservedSeats { get; set; } = [];
    }
}
