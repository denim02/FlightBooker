namespace FlightBooker.Server.Data.Models.DTOs.Reservations
{
    public class ReservationClientDataDTO
    {
        public int Id { get; set; }
        public string RouteName { get; set; } = null!;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public DateTime ReservationDate { get; set; }
        public ReservationSeatDataDTO[] ReservationSeatsData { get; set; } = [];
    }
}
