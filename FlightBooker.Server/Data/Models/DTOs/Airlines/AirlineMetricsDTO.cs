using FlightBooker.Server.Data.Models.DTOs.Routes;

namespace FlightBooker.Server.Data.Models.DTOs.Airlines
{
    public class AirlineMetricsDTO
    {
        public int MonthlyReservations { get; set; }
        public int MonthlyFlights { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public ICollection<SimplifiedFlightDataDTO>? UpcomingFlights { get; set; } = null;
    }
}
