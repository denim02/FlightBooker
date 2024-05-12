using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class SeatClass
    {
        [Required]
        public int SeatClassId { get; set; }

        [Required]
        [StringLength(100)]
        // Defined to be unique using Fluent API
        public string ClassName { get; set; } = null!;
    }
}
