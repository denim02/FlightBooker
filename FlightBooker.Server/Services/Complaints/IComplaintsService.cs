using FlightBooker.Server.Data.Models.DTOs.Complaints;

namespace FlightBooker.Server.Services.Complaints
{
    public interface IComplaintsService
    {
        Task<ICollection<ComplaintData>> GetAllComplaints();
        Task<ComplaintData> GetComplaint(int id);
        Task CreateComplaint(string complainantId, string description);
        Task DeleteComplaint(int id);
        Task RespondToComplaint(int id, string adminId, string response);
        Task<ComplaintMetrics> GetComplaintMetrics(string id);
    }
}
