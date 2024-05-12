using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Airplanes;

namespace FlightBooker.Server.Services.Airplanes
{
    public interface IAirplanesService
    {
        Task<ICollection<AirplaneData>> GetAllPlanes();
        Task<AirplaneData> GetPlaneById(int id);
        Task CreatePlane(string brand, string model, uint nrRows, uint nrColumns, RowSeatClassMapping[] seatConfiguration);
        Task DeleteAirplane(int id);
        Task<AirplaneData> UpdateAirplane(Airplane updatedModel);
        Task<AirplaneSeatDataDTO> GetAirplaneSeatData(int id);
        Task<ICollection<RowSeatClassMapping>> GetRowSeatClassMappingsForPlane(int id);
        Task UpdateRowSeatClassMappings(int id, RowSeatClassMapping[] rowSeatClassMappings);
    }
}
