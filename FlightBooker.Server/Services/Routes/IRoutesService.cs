using FlightBooker.Server.Data.Models.DTOs.Routes;

namespace FlightBooker.Server.Services.Routes
{
    public interface IRoutesService
    {
        Task<ICollection<RouteDataDTO>> GetAllRoutes();
        Task<ICollection<RouteDataDTO>> GetAllRoutesForAirline(int id);
        Task<ICollection<RouteSearchResultDTO>> SearchRoutes(RouteSearchDTO searchParams);
        Task<ICollection<SimplifiedFlightDataDTO>> GetAllFlights();
        Task<ICollection<SimplifiedFlightDataDTO>> GetAllFlightsForAirline(int id);
        Task UpdateFlightDelay(int id, double delay);
        Task<RouteDataDTO> GetRoute(int id);
        Task<RouteBookingDataDTO> GetRouteBookingData(int id);
        Task CreateRoute(RouteCreateDTO routeData);
        Task DeleteRoute(int id);
        Task DeleteRouteGroup(int routeGroupId);
    }
}
