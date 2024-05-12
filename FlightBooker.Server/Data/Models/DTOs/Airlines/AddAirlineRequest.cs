namespace FlightBooker.Server.Data.Models.DTOs.Airlines
{
    public class AddAirlineRequest
    {
        public string AirlineName { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public string Country { get; set; } = null!;

        public ICollection<string> AirlineOperatorIds { get; set; } = new List<string>();
    }
}
