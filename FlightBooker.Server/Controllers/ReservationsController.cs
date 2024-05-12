using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Reservations;
using FlightBooker.Server.Services.Reservations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly IReservationsService _reservationsService;

        public ReservationsController(IReservationsService reservationsService)
        {
            _reservationsService = reservationsService;
        }

        // GET: /reservations
        [HttpGet]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetReservations()
        {
            return Ok(await _reservationsService.GetAllReservations());
        }

        // GET: /reservations/airline/5
        [HttpGet("airline/{airlineId}")]
        [Authorize("RequirePrivilegedRole")]
        public async Task<IActionResult> GetReservationsForAirline(int airlineId)
        {
            return Ok(await _reservationsService.GetAllReservationsForAirline(airlineId));
        }

        // GET: /reservations/client/12a-2312-b
        [HttpGet("client/{clientId}")]
        [Authorize]
        public async Task<IActionResult> GetReservationsForClient(string clientId)
        {
            return Ok(await _reservationsService.GetAllReservationsForClient(clientId));
        }

        // GET: /reservations/5
        [HttpGet("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetReservation(int id)
        {
            try
            {
                var reservation = await _reservationsService.GetReservation(id);
                return Ok(reservation);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // POST: /reservations
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostReservation([FromBody] ReservationCreateDTO reservationData)
        {
            try
            {
                var reservationId = await _reservationsService.CreateReservation(reservationData);
                return Ok(reservationId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
