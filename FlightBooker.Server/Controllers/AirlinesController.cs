using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Data.Models.DTOs.Airlines;
using FlightBooker.Server.Services.Airlines;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AirlinesController : ControllerBase
    {
        private readonly IAirlinesService _airlinesService;

        public AirlinesController(IAirlinesService airlinesService)
        {
            _airlinesService = airlinesService;
        }

        // GET: /airlines
        [HttpGet]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetAirlines()
        {
            return Ok(await _airlinesService.GetAllAirlines());
        }

        // GET: /airlines/5
        [HttpGet("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetAirline(int id)
        {
            try
            {
                var airline = await _airlinesService.GetAirline(id);
                return Ok(airline);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // GET: /airlines/operators
        [HttpGet("operators")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetAirlineOperators()
        {
            try
            {
                return Ok(await _airlinesService.GetAirlineOperators());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: /airlines/operators/3
        [HttpGet("operators/{id}")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> GetAirlineForOperator(string id)
        {
            try
            {
                return Ok(await _airlinesService.GetAirlineForOperator(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: /airlines/5/metrics
        [HttpGet("/airlines/{id}/metrics")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> GetAirlineMetrics(int id)
        {
            try
            {
                return Ok(await _airlinesService.GetAirlineMetrics(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: /airlines/5
        [HttpPut("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PutAirline(int id, [FromBody] Airline airline)
        {
            try
            {
                return Ok(await _airlinesService.UpdateAirline(id, airline));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /airlines
        [HttpPost]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PostAirline([FromBody] AddAirlineRequest addAirlineRequest)
        {
            try
            {
                var newPlane = new Airline
                {
                    AirlineName = addAirlineRequest.AirlineName,
                    Country = addAirlineRequest.Country,
                    PhoneNumber = addAirlineRequest.PhoneNumber,
                    EmailAddress = addAirlineRequest.EmailAddress
                };

                await _airlinesService.CreateAirline(newPlane, addAirlineRequest.AirlineOperatorIds);
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

        // DELETE: /airlines/5
        [HttpDelete("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> DeleteAirline(int id)
        {
            try
            {
                await _airlinesService.DeleteAirline(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: /airlines/5/operators
        [HttpPut("{id}/operators")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PutAirlineOperators(int id, [FromBody] ICollection<string> operatorIds)
        {
            try
            {
                await _airlinesService.SetAirlineOperators(id, operatorIds);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
