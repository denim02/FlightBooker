using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Airplanes;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Airplanes
{
    public class AirplanesService : IAirplanesService
    {
        private readonly ApplicationDbContext _context;

        public AirplanesService(ApplicationDbContext dbcontext)
        {
            _context = dbcontext;
        }

        public async Task DeleteAirplane(int id)
        {
            var plane = await _context.Airplanes.FindAsync(id);

            if (plane == null)
                throw new ArgumentException($"No airplane with id {id} exists");

            _context.Airplanes.Remove(plane);
            await _context.SaveChangesAsync();
        }

        public async Task<AirplaneSeatDataDTO> GetAirplaneSeatData(int id)
        {
            var plane = await _context.Airplanes.Where(e => e.AirplaneId == id).Include(e => e.AirplaneSeats).FirstOrDefaultAsync();

            if (plane == null)
                throw new ArgumentException($"No airplane with id {id} exists");

            var mappings = await GetRowSeatClassMappingsForPlane(id);

            return new AirplaneSeatDataDTO
            {
                NrRows = plane.NrRows,
                NrColumns = plane.NrColumns,
                Seats = plane.AirplaneSeats.Select(seat => new IndividualSeatDataDTO(seat)).ToList(),
                CabinClassMappings = mappings
            };
        }

        public async Task<ICollection<AirplaneData>> GetAllPlanes()
        {
            return await _context.Airplanes.Select(plane => new AirplaneData(plane)).ToListAsync();
        }

        public async Task<AirplaneData> GetPlaneById(int id)
        {
            var plane = await _context.Airplanes.Where(e => e.AirplaneId == id).Include(e => e.AirplaneSeats).FirstAsync();

            if (plane == null)
                throw new ArgumentException($"No airplane with id {id} exists");

            return new AirplaneData(plane);
        }

        public async Task<AirplaneData> UpdateAirplane(Airplane updatedModel)
        {
            var plane = await _context.Airplanes.FindAsync(updatedModel.AirplaneId);

            plane.AirplaneModel = updatedModel.AirplaneModel;
            plane.AirplaneBrand = updatedModel.AirplaneBrand;
            plane.NrColumns = updatedModel.NrColumns;
            plane.NrRows = updatedModel.NrRows;
            plane.AirplaneSeats = updatedModel.AirplaneSeats;

            await _context.SaveChangesAsync();
            return new AirplaneData(plane);
        }

        public async Task CreatePlane(string brand, string model, uint nrRows, uint nrColumns, RowSeatClassMapping[] seatConfiguration)
        {
            var newPlane = new Airplane
            {
                AirplaneBrand = brand,
                AirplaneModel = model,
                NrRows = nrRows,
                NrColumns = nrColumns
            };

            var airplaneSeats = newPlane.GenerateAirplaneSeats(seatConfiguration);
            newPlane.AirplaneSeats = airplaneSeats;

            await _context.Airplanes.AddAsync(newPlane);
            await _context.SaveChangesAsync();
        }

        public async Task<ICollection<RowSeatClassMapping>> GetRowSeatClassMappingsForPlane(int id)
        {
            // Check if plane exists
            var plane = await _context.Airplanes.FindAsync(id);

            if (plane == null)
                throw new ArgumentException($"No airplane with id {id} exists");

            var seatRows = _context.AirplaneSeats.Where(e => e.AirplaneId == id).Include(e => e.SeatClass).GroupBy(e => e.SeatClassId).ToList();

            var mappings = new List<RowSeatClassMapping>();
            foreach (var seatRow in seatRows)
            {
                mappings.Add(new RowSeatClassMapping
                {
                    Rows = seatRow.Select(e => e.SeatRow).Distinct().ToArray(),
                    SeatClass = seatRow.Key
                });
            }


            return mappings;
        }

        public async Task UpdateRowSeatClassMappings(int id, RowSeatClassMapping[] rowSeatClassMappings)
        {
            // Check if plane exists
            var plane = await _context.Airplanes.Where(e => e.AirplaneId == id).Include(e => e.AirplaneSeats).FirstOrDefaultAsync();

            if (plane == null)
                throw new ArgumentException($"No airplane with id {id} exists");

            foreach (var airplaneSeat in plane.AirplaneSeats)
            {
                var mapping = rowSeatClassMappings.Where(e => e.Rows.Contains(airplaneSeat.SeatRow)).FirstOrDefault();
                if (mapping != null)
                {
                    airplaneSeat.SeatClassId = mapping.SeatClass;
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
