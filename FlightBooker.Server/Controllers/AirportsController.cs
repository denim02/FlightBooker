using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Services.Airports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AirportsController : ControllerBase
    {
        private readonly IAirportsService _airportsService;

        public AirportsController(IAirportsService airportsService)
        {
            _airportsService = airportsService;
        }

        // GET: /airports
        [HttpGet]
        public async Task<IActionResult> GetAirports()
        {
            return Ok(await _airportsService.GetAllAirports());
        }

        // GET: /airports/5
        [HttpGet("{id}")]
        [Authorize("RequirePrivilegedRole")]
        public async Task<IActionResult> GetAirport(string id)
        {
            try
            {
                var airport = await _airportsService.GetAirport(id);
                return Ok(airport);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // PUT: /airports/5
        [HttpPut("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PutAirport(string id, [FromBody] Airport airport)
        {
            try
            {
                return Ok(await _airportsService.UpdateAirport(id, airport));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /airports
        [HttpPost]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PostAirport(Airport airport)
        {
            try
            {
                await _airportsService.CreateAirport(airport);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("airport code"))
                {
                    return BadRequest(new FormValidationResponse
                    {
                        IsSuccessful = false,
                        Errors = new Dictionary<string, string[]>
                        {
                            { "AirportCode", [ex.Message] }
                        }
                    });
                }
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

        // DELETE: /airports/5
        [HttpDelete("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> DeleteAirport(string id)
        {
            try
            {
                await _airportsService.DeleteAirport(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
