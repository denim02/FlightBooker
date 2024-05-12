using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Airlines;
using FlightBooker.Server.Data.Models.DTOs.Users;

namespace FlightBooker.Server.Services.Airlines
{
    public interface IAirlinesService
    {
        Task<ICollection<AirlineData>> GetAllAirlines();
        Task<AirlineData> GetAirline(int id);
        Task<ICollection<AirlineOperatorData>> GetAirlineOperators();
        Task<AirlineData?> GetAirlineForOperator(string id);
        Task<AirlineMetricsDTO> GetAirlineMetrics(int id);
        Task CreateAirline(Airline airline, ICollection<string> airlineOperatorIds);
        Task<AirlineData> UpdateAirline(int id, Airline updatedAirline);
        Task DeleteAirline(int id);
        Task SetAirlineOperators(int airlineId, ICollection<string> airlineOperatorIds);
    }
}
