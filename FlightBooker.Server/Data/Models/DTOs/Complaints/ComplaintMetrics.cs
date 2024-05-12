namespace FlightBooker.Server.Data.Models.DTOs.Complaints
{
    public class ComplaintMetrics
    {
        public int UnresolvedComplaints { get; set; }
        public int ComplaintsAssignedThisMonth { get; set; }
        public int ComplaintsIssuedThisWeek { get; set; }
        public ICollection<ComplaintData> RecentComplaints { get; set; } = new List<ComplaintData>();
    }
}
