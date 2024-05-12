using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Airports
{
    public class AirportsService : IAirportsService
    {
        private readonly ApplicationDbContext _context;

        public AirportsService(ApplicationDbContext context)
        {
            _context = context;
        }


        public async Task CreateAirport(Airport newAirport)
        {
            // Check if airport with the given code exists
            var existingAirport = await _context.Airports.FindAsync(newAirport.AirportCode);

            if (existingAirport != null)
                throw new Exception($"An airport with airport code {existingAirport.AirportCode} already exists.");

            await _context.Airports.AddAsync(newAirport);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAirport(string id)
        {
            // Check if an airport with that id exists
            var airport = await _context.Airports.FindAsync(id);

            if (airport == null)
                throw new Exception($"No airport with airport code {id} exists.");

            _context.Airports.Remove(airport);
            await _context.SaveChangesAsync();
        }

        public async Task<Airport> GetAirport(string id)
        {
            var airport = await _context.Airports.FindAsync(id);

            if (airport == null)
                throw new Exception($"No airport with airport code {id} exists.");

            return airport;
        }

        public async Task<ICollection<Airport>> GetAllAirports()
        {
            return await _context.Airports.ToListAsync();
        }

        public async Task<Airport> UpdateAirport(string id, Airport updatedAirport)
        {
            // Find airport that must be modified
            var airport = await _context.Airports.FindAsync(id);

            if (airport == null)
                throw new Exception($"No airport with airport code {id} exists.");

            airport.AirportCode = updatedAirport.AirportCode;
            airport.AirportName = updatedAirport.AirportName;
            airport.Country = updatedAirport.Country;
            airport.City = updatedAirport.City;

            await _context.SaveChangesAsync();
            return airport;
        }
    }
}
