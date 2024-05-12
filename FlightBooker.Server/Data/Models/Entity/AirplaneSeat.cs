using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class AirplaneSeat
    {
        [Key]
        public int AirplaneSeatId { get; set; }

        public uint SeatRow { get; set; }

        [RegularExpression(@"^[A-Z]$")]
        public char SeatColumn { get; set; }

        // Foreign Keys and properties to access related entities
        public int AirplaneId { get; set; }
        public Airplane Airplane { get; set; } = null!;

        public int SeatClassId { get; set; }
        public SeatClass SeatClass { get; set; } = null!;
    }
}
