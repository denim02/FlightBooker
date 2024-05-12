namespace FlightBooker.Server.Data.Models.DTOs.Complaints
{
    public class ComplaintData
    {
        public int Id { get; set; }
        public string Description { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string? AssignedAdminName { get; set; }
        public bool IsResolved { get; set; }
        public DateTime DateIssued { get; set; }
        public DateTime? DateResolved { get; set; }
    }
}
