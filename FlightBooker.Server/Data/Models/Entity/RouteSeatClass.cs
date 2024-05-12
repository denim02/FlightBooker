using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public class RouteSeatClass
    {
        public int RouteSeatClassId { get; set; }

        public int RouteId { get; set; }

        public int SeatClassId { get; set; }

        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        // Foreign Keys and properties to access related entities
        public Route Route { get; set; } = null!;
        public SeatClass SeatClass { get; set; } = null!;
    }
}
