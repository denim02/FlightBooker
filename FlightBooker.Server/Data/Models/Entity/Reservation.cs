using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public class Reservation
    {
        public int ReservationId { get; set; }
        public string ClientId { get; set; } = null!;
        public int RouteId { get; set; }
        public DateTime ReservationDate { get; set; }
        public DateTime DepartureDate
        {
            get
            {
                // Get flight with earliest departure date
                return Route.Flights.OrderBy(e => e.DepartureTime).First().DepartureTime;
            }
        }
        public DateTime ArrivalDate
        {
            get
            {
                // Get flight with latest departure date
                return Route.Flights.OrderByDescending(e => e.DepartureTime).First().DepartureTime;
            }
        }
        public decimal TotalCost
        {
            get
            {
                decimal totalCost = 0;

                // Get route seat prices for the reservation
                var routeSeatClassesLookup = new Dictionary<int, decimal>();
                foreach (var routeSeatClass in Route.RouteSeatClasses)
                {
                    routeSeatClassesLookup.Add(routeSeatClass.SeatClassId, routeSeatClass.Price);
                }

                // Get flight seats for the reservation
                foreach (var flightSeat in FlightSeats)
                {
                    totalCost += routeSeatClassesLookup[flightSeat.AirplaneSeat.SeatClassId];
                }

                return totalCost;
            }
        }

        // Relationships
        [ForeignKey("ClientId")]
        public AppUser Client { get; set; } = null!;
        public Route Route { get; set; } = null!;
        public ICollection<FlightSeat> FlightSeats { get; set; } = new List<FlightSeat>();
    }
}
