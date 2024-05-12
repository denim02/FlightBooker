namespace FlightBooker.Server.Data.Models.DTOs.Complaints
{
    public class AddComplaintRequest
    {
        public string ComplainantId { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
