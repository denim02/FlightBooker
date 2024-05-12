using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public class AirlineOperator
    {
        public int AirlineOperatorId { get; set; }

        public string UserId { get; set; } = null!;
        [ForeignKey("UserId")]
        public AppUser User { get; set; } = null!;

        public int? AirlineId { get; set; }
        [ForeignKey("AirlineId")]
        public Airline? Airline { get; set; } = null!;
    }
}
