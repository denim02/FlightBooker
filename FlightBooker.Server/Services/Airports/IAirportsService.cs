using FlightBooker.Server.Data.Models;

namespace FlightBooker.Server.Services.Airports
{
    public interface IAirportsService
    {
        Task<ICollection<Airport>> GetAllAirports();
        Task<Airport> GetAirport(string id);
        Task CreateAirport(Airport airport);
        Task<Airport> UpdateAirport(string id, Airport airport);
        Task DeleteAirport(string id);

    }
}
