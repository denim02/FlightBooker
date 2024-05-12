using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models.DTOs.Airplanes
{
    public class AddAirplaneRequest
    {
        public string Brand { get; set; } = null!;

        public string Model { get; set; } = null!;

        [Range(1, 100)]
        public uint NrRows { get; set; }

        [Range(1, 9)]
        public uint NrColumns { get; set; }

        [Required]
        public RowSeatClassMapping[] SeatConfiguration { get; set; } = null!;
    }
}
