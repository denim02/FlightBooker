using System.ComponentModel.DataAnnotations.Schema;

namespace FlightBooker.Server.Data.Models
{
    public class Complaint
    {
        public int ComplaintId
        {
            get; set;
        }
        public DateTime DateIssued
        {
            get; set;
        }
        public string Description { get; set; } = null!;
        public bool IsResolved { get; set; } = false;
        public DateTime? DateResolved
        {
            get; set;
        }
        public bool IsRemoved { get; set; } = false;

        public string ComplainantId
        {
            get; set;
        }
        [ForeignKey(nameof(ComplainantId))]
        public AppUser Complainant { get; set; } = null!;

        public string? AssignedAdminId
        {
            get; set;
        }
        [ForeignKey(nameof(AssignedAdminId))]
        public AppUser? AssignedAdmin
        {
            get; set;
        }

    }
}
