using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Data.Models.DTOs.Routes;
using FlightBooker.Server.Services.Routes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoutesController : ControllerBase
    {
        private readonly IRoutesService _routesService;

        public RoutesController(IRoutesService routesService)
        {
            _routesService = routesService;
        }

        // GET: /routes?airlineId=4
        [HttpGet]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> GetRoutes(int airlineId = -1)
        {
            if (airlineId != -1)
            {
                try
                {
                    var routes = await _routesService.GetAllRoutesForAirline(airlineId);
                    return Ok(routes);
                }
                catch (Exception ex)
                {
                    return NotFound(ex.Message);

                }
            }

            return Ok(await _routesService.GetAllRoutes());
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchRoutes([FromQuery] RouteSearchDTO searchParams)
        {
            try
            {
                var routes = await _routesService.SearchRoutes(searchParams);
                return Ok(routes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: /routes/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoute(int id)
        {
            try
            {
                var route = await _routesService.GetRoute(id);
                return Ok(route);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);

            }
        }

        // GET: /routes/5/booking
        [HttpGet("{id}/booking")]
        [Authorize]
        public async Task<IActionResult> GetRouteBookingData(int id)
        {
            try
            {
                var reservationData = await _routesService.GetRouteBookingData(id);
                return Ok(reservationData);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: /flights?airlineId=4
        [HttpGet("/flights")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> GetFlights(int airlineId = -1)
        {
            if (airlineId != -1)
            {
                try
                {
                    var flights = await _routesService.GetAllFlightsForAirline(airlineId);
                    return Ok(flights);
                }
                catch (Exception ex)
                {
                    return NotFound(ex.Message);

                }
            }

            return Ok(await _routesService.GetAllFlights());
        }

        // POST: /flights/5/delay
        [HttpPost("/flights/{id}/delay")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> DelayFlight(int id, [FromBody] FlightDelayDTO delayRequest)
        {
            try
            {
                await _routesService.UpdateFlightDelay(id, delayRequest.Delay);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: /routes
        [HttpPost]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> PostRoute(RouteCreateDTO routeData)
        {
            try
            {
                await _routesService.CreateRoute(routeData);
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

        // DELETE: /routes/5
        [HttpDelete("{id}")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> DeleteRoute(int id)
        {
            try
            {
                await _routesService.DeleteRoute(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE /routes/group/4
        [HttpDelete("group/{routeGroupId}")]
        [Authorize("RequireAirlineOperatorRole")]
        public async Task<IActionResult> DeleteRouteGroup(int routeGroupId)
        {
            try
            {
                await _routesService.DeleteRouteGroup(routeGroupId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
