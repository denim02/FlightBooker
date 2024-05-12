using FlightBooker.Server.Data.Models.DTOs.Users;

namespace FlightBooker.Server.Data.Models.DTOs.Airlines
{
    public class AirlineData
    {
        public int Id { get; set; }
        public string AirlineName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public string Country { get; set; } = null!;

        public AirlineOperatorData[] AirlineOperators { get; set; } = null!;
    }
}
