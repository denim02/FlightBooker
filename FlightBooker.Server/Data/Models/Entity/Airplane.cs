using FlightBooker.Server.Data.Models.DTOs.Airplanes;
using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class Airplane
    {
        public int AirplaneId { get; set; }

        [Required]
        public string AirplaneBrand { get; set; } = null!;

        [Required]
        public string AirplaneModel { get; set; } = null!;

        [Required]
        [Range(1, 200)]
        public uint NrRows { get; set; }

        [Required]
        [Range(1, 30)]
        public uint NrColumns { get; set; }

        // Generated Column
        public uint TotalCapacity
        {
            get
            {
                return NrColumns * NrRows;
            }
        }

        // Foreign Keys and properties to access related entities
        public ICollection<AirplaneSeat> AirplaneSeats { get; set; } = new List<AirplaneSeat>();

        public ICollection<AirplaneSeat> GenerateAirplaneSeats(RowSeatClassMapping[] seatClassMappings)
        {
            var airplaneSeats = new List<AirplaneSeat>();

            foreach (var mapping in seatClassMappings)
            {
                foreach (var row in mapping.Rows)
                {
                    for (char column = 'A'; column < 'A' + NrColumns; column++)
                    {
                        airplaneSeats.Add(new AirplaneSeat
                        {
                            AirplaneId = AirplaneId,
                            SeatRow = row,
                            SeatColumn = column,
                            SeatClassId = mapping.SeatClass,
                            Airplane = this
                        });
                    }
                }
            }

            return airplaneSeats;
        }
    }
}
