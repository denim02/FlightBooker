using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models.DTOs.Complaints;
using FlightBooker.Server.Services.Email.Templates;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Complaints
{
    public class ComplaintsService : IComplaintsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ComplaintsService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task CreateComplaint(string complainantId, string description)
        {
            // Check if a user with that id exists
            var complainant = await _context.Users.FindAsync(complainantId);

            if (complainant == null)
                throw new Exception($"No user with id {complainantId} exists.");

            var newComplaint = new Data.Models.Complaint
            {
                ComplainantId = complainantId,
                DateIssued = DateTime.Now,
                Description = description,
                IsRemoved = false,
                IsResolved = false,
            };

            await _context.Complaints.AddAsync(newComplaint);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteComplaint(int id)
        {
            // Check if an complaint with that id exists
            var complaint = await _context.Complaints.FindAsync(id);

            if (complaint == null)
                throw new Exception($"No complaint with id {id} exists.");

            complaint.IsRemoved = true;
            await _context.SaveChangesAsync();
        }

        public async Task<ComplaintData> GetComplaint(int id)
        {
            var complaint = await _context.Complaints.Where(e => e.ComplaintId == id).Include(e => e.AssignedAdmin).Include(e => e.Complainant).FirstOrDefaultAsync();

            if (complaint == null)
                throw new Exception($"No complaint with id {id} exists.");

            return new ComplaintData
            {
                Id = complaint.ComplaintId,
                Description = complaint.Description,
                UserId = complaint.ComplainantId,
                AssignedAdminName = complaint.AssignedAdmin != null ? (complaint.AssignedAdmin.FirstName + " " + complaint.AssignedAdmin.LastName) : null,
                DateIssued = complaint.DateIssued,
                DateResolved = complaint.DateResolved,
                IsResolved = complaint.IsResolved
            };
        }

        public async Task<ICollection<ComplaintData>> GetAllComplaints()
        {
            return await _context.Complaints.Where(e => !e.IsRemoved).Include(e => e.Complainant).Include(e => e.AssignedAdmin).Select(e => new ComplaintData
            {
                Id = e.ComplaintId,
                Description = e.Description,
                UserId = e.ComplainantId,
                AssignedAdminName = e.AssignedAdmin != null ? (e.AssignedAdmin.FirstName + " " + e.AssignedAdmin.LastName) : null,
                DateIssued = e.DateIssued,
                DateResolved = e.DateResolved,
                IsResolved = e.IsResolved
            }).ToListAsync();
        }

        public async Task RespondToComplaint(int id, string adminId, string response)
        {
            // Verify that an admin with that id exists
            var admin = await _context.Users.FindAsync(adminId);

            if (admin == null)
                throw new Exception($"No admin with id {id} exists.");

            // Find complaint that must be modified
            var complaint = await _context.Complaints.Where(e => e.ComplaintId == id).Include(e => e.Complainant).FirstOrDefaultAsync();
            if (complaint == null)
                throw new Exception($"No complaint with complaint id {id} exists.");

            complaint.AssignedAdmin = admin;
            complaint.DateResolved = DateTime.Now;
            complaint.IsResolved = true;
            await _context.SaveChangesAsync();

            _emailService.SendEmailAsync(new EmailData
            {
                EmailToId = complaint.Complainant.Email!,
                EmailToName = (complaint.Complainant.FirstName + " " + complaint.Complainant.LastName),
                EmailSubject = $"Ticket #{complaint.ComplaintId} - Response",
                EmailTextBody = $"Please see below an administrator's response to ticket #{complaint.ComplaintId} which you opened on {complaint.DateIssued.Date}:\n{response}",
                EmailHtmlBody = ComplaintResponseTemplate.GenerateBody(complaint.ComplaintId.ToString(), complaint.DateIssued.Date.ToString(), response)
            });
        }

        public async Task<ComplaintMetrics> GetComplaintMetrics(string id)
        {
            var admin = await _context.Users.FindAsync(id);

            if (admin == null)
                throw new Exception($"No admin with id {id} found.");

            var complaintsAssignedThisMonth = await _context.Complaints.Where(e => e.AssignedAdminId == id && e.DateIssued > DateTime.Now.AddMonths(-1)).CountAsync();
            var complaintsIssuedThisWeek = await _context.Complaints.Where(e => e.DateIssued > DateTime.Now.AddDays(-7)).CountAsync();
            var unresolvedComplaints = await _context.Complaints.Where(e => !e.IsResolved).CountAsync();
            var recentComplaints = await _context.Complaints.OrderByDescending(e => e.DateIssued).Take(5).Include(e => e.AssignedAdmin).Select(e => new ComplaintData
            {
                Id = e.ComplaintId,
                Description = e.Description,
                UserId = e.ComplainantId,
                AssignedAdminName = e.AssignedAdmin != null ? (e.AssignedAdmin.FirstName + " " + e.AssignedAdmin.LastName) : null,
                DateIssued = e.DateIssued,
                DateResolved = e.DateResolved,
                IsResolved = e.IsResolved
            }).ToArrayAsync();

            return new ComplaintMetrics
            {
                ComplaintsAssignedThisMonth = complaintsAssignedThisMonth,
                ComplaintsIssuedThisWeek = complaintsIssuedThisWeek,
                UnresolvedComplaints = unresolvedComplaints,
                RecentComplaints = recentComplaints
            };
        }
    }
}
