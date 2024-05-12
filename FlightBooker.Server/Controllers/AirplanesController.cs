using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Data.Models.DTOs.Airplanes;
using FlightBooker.Server.Services.Airplanes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AirplanesController : ControllerBase
    {
        private readonly IAirplanesService _airplanesService;

        public AirplanesController(IAirplanesService airplanesService)
        {
            _airplanesService = airplanesService;
        }

        // GET: /airplanes
        [HttpGet]
        [Authorize("RequirePrivilegedRole")]
        public async Task<IActionResult> Get()
        {
            return Ok(await _airplanesService.GetAllPlanes());
        }

        // GET /airplanes/5
        [HttpGet("{id}")]
        [Authorize("RequirePrivilegedRole")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                return Ok(await _airplanesService.GetPlaneById(id));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST /airplanes
        [HttpPost]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> Post([FromBody] AddAirplaneRequest newPlaneRequest)
        {
            try
            {
                await _airplanesService.CreatePlane(newPlaneRequest.Model, newPlaneRequest.Brand, newPlaneRequest.NrRows, newPlaneRequest.NrColumns, newPlaneRequest.SeatConfiguration);
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

        // PUT /airplanes/5
        [HttpPut("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> Put(int id, [FromBody] Airplane updatedModel)
        {
            try
            {
                return Ok(await _airplanesService.UpdateAirplane(updatedModel));
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

        // DELETE /airplanes/5
        [HttpDelete("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _airplanesService.DeleteAirplane(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET /airplanes/5/seats
        [HttpGet("{id}/seats")]
        [Authorize]
        public async Task<IActionResult> GetAirplaneSeatData(int id)
        {
            try
            {
                return Ok(await _airplanesService.GetAirplaneSeatData(id));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET /airplanes/5/seat-configuration
        [HttpGet("{id}/seat-configuration")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetRowSeatClassMappings(int id)
        {
            try
            {
                return Ok(await _airplanesService.GetRowSeatClassMappingsForPlane(id));
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // PUT /airplanes/5/seat-configuration
        [HttpPut("{id}/seat-configuration")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> PutRowSeatClassMappings(int id, [FromBody] RowSeatClassMapping[] mappings)
        {
            try
            {
                await _airplanesService.UpdateRowSeatClassMappings(id, mappings);
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
    }
}
