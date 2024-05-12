using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Data.Models.DTOs.Complaints;
using FlightBooker.Server.Services.Complaints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintsService _complaintsService;

        public ComplaintsController(IComplaintsService complaintsService)
        {
            _complaintsService = complaintsService;
        }

        // GET: /complaints
        [HttpGet]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetComplaints()
        {
            return Ok(await _complaintsService.GetAllComplaints());
        }

        // GET: /complaints/5
        [HttpGet("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetComplaint(int id)
        {
            try
            {
                var complaint = await _complaintsService.GetComplaint(id);
                return Ok(complaint);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // POST: /complaints
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostComplaint([FromBody] AddComplaintRequest addComplaintRequest)
        {
            try
            {
                await _complaintsService.CreateComplaint(addComplaintRequest.ComplainantId, addComplaintRequest.Description);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new FormValidationResponse
                {
                    IsSuccessful = false,
                    Errors = new Dictionary<string, string[]>
                    {
                        { "GeneralError", [ex.Message] }
                    }
                });
            }
        }

        // DELETE: /complaints/5
        [HttpDelete("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> DeleteComplaint(int id)
        {
            try
            {
                await _complaintsService.DeleteComplaint(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /complaints/respond/5
        [HttpPost("respond/{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> RespondToComplaint(int id, [FromBody] ComplaintResponseRequest response)
        {
            try
            {
                await _complaintsService.RespondToComplaint(id, response.AdminId, response.Response);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: /complaints/metrics?id=5
        [HttpGet("metrics")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetComplaintMetrics([FromQuery] string id)
        {
            try
            {
                return Ok(await _complaintsService.GetComplaintMetrics(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
