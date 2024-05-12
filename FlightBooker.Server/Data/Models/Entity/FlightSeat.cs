using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public class FlightSeat
    {
        public int FlightSeatId { get; set; }
        public int FlightId { get; set; }
        public int AirplaneSeatId { get; set; }
        public int? ReservationId { get; set; }
        public string SeatNumber
        {
            get
            {
                return AirplaneSeat.SeatRow + AirplaneSeat.SeatColumn.ToString();
            }
        }
        public bool IsBooked
        {
            get
            {
                return ReservationId.HasValue;
            }
        }

        // Relationships
        [ForeignKey(nameof(FlightId))]
        public Flight Flight { get; set; } = null!;

        [ForeignKey(nameof(AirplaneSeatId))]
        public AirplaneSeat AirplaneSeat { get; set; } = null!;

        [ForeignKey(nameof(ReservationId))]
        public Reservation? Reservation { get; set; }

    }
}
