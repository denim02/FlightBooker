using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Airlines;
using FlightBooker.Server.Data.Models.DTOs.Routes;
using FlightBooker.Server.Data.Models.DTOs.Users;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Airlines
{
    public class AirlinesService : IAirlinesService
    {
        private readonly ApplicationDbContext _context;

        public AirlinesService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAirline(Airline airline, ICollection<string> airlineOperatorIds)
        {
            var existingAirline = await _context.Airlines.FindAsync(airline.AirlineId);

            if (existingAirline != null)
            {
                throw new Exception($"An airline with id {airline.AirlineId} already exists");
            }

            foreach (var userId in airlineOperatorIds)
            {
                var airlineOperator = await _context.AirlineOperators.Where(e => e.UserId == userId).FirstOrDefaultAsync();

                if (airlineOperator == null)
                    throw new Exception($"No airline operator with the given id {userId}");

                airline.Operators?.Add(airlineOperator);
            }

            await _context.Airlines.AddAsync(airline);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAirline(int id)
        {
            // Check if an airline with id exists
            var airline = await _context.Airlines.Where(e => e.AirlineId == id).Include(e => e.Operators).FirstOrDefaultAsync();

            if (airline == null)
                throw new Exception($"No airline with id {id} exists.");

            if (airline.Operators != null)
                airline.Operators.Clear();

            _context.Airlines.Remove(airline);
            await _context.SaveChangesAsync();
        }

        public async Task<AirlineData> GetAirline(int id)
        {
            var airline = await _context.Airlines.Where(e => e.AirlineId == id).Include(e => e.Operators).ThenInclude(o => o.User).FirstOrDefaultAsync();

            if (airline == null)
                throw new Exception($"No airline with id {id} exists.");

            return new AirlineData
            {
                Id = airline.AirlineId,
                AirlineName = airline.AirlineName,
                Country = airline.Country,
                PhoneNumber = airline.PhoneNumber,
                EmailAddress = airline.EmailAddress,
                AirlineOperators = airline.Operators?.Select(e => new AirlineOperatorData
                {
                    Id = e.UserId,
                    FirstName = e.User.FirstName,
                    LastName = e.User.LastName,
                    Email = e.User.Email,
                    PhoneNumber = e.User.PhoneNumber,
                    Role = Enum.Parse<UserRole>("AirlineOperator"),
                    AirlineId = airline.AirlineId
                }).ToArray() ?? []
            };
        }

        public async Task<ICollection<AirlineData>> GetAllAirlines()
        {
            return await _context.Airlines.Include(e => e.Operators).ThenInclude(o => o.User).Select(e => new AirlineData
            {
                Id = e.AirlineId,
                AirlineName = e.AirlineName,
                Country = e.Country,
                PhoneNumber = e.PhoneNumber,
                EmailAddress = e.EmailAddress,
                AirlineOperators = e.Operators.Select(o => new AirlineOperatorData
                {
                    Id = o.UserId,
                    FirstName = o.User.FirstName,
                    LastName = o.User.LastName,
                    Email = o.User.Email,
                    PhoneNumber = o.User.PhoneNumber,
                    Role = Enum.Parse<UserRole>("AirlineOperator"),
                    AirlineId = e.AirlineId
                }).ToArray()
            }).ToListAsync();
        }

        public async Task<ICollection<AirlineOperatorData>> GetAirlineOperators()
        {
            return await _context.AirlineOperators.Include(e => e.User).Select(e => new AirlineOperatorData
            {
                Id = e.UserId,
                FirstName = e.User.FirstName,
                LastName = e.User.LastName,
                Email = e.User.Email,
                PhoneNumber = e.User.PhoneNumber,
                Role = Enum.Parse<UserRole>("AirlineOperator"),
                AirlineId = e.AirlineId
            }).ToListAsync();
        }

        public async Task<AirlineData?> GetAirlineForOperator(string id)
        {
            var airlineOperator = await _context.AirlineOperators.Where(e => e.UserId == id).Include(e => e.Airline).FirstOrDefaultAsync();

            if (airlineOperator == null)
                throw new Exception($"No operator with id {id} exists");

            if (airlineOperator.Airline == null)
                return null;
            else
                return new AirlineData
                {
                    Id = airlineOperator.Airline.AirlineId,
                    AirlineName = airlineOperator.Airline.AirlineName,
                    Country = airlineOperator.Airline.Country,
                    PhoneNumber = airlineOperator.Airline.PhoneNumber,
                    EmailAddress = airlineOperator.Airline.EmailAddress,
                };
        }

        public async Task SetAirlineOperators(int airlineId, ICollection<string> userIds)
        {
            var airline = await _context.Airlines.Where(e => e.AirlineId == airlineId).Include(e => e.Operators).FirstOrDefaultAsync();

            if (airline == null)
                throw new Exception($"No airline with id {airlineId} exists.");

            airline.Operators?.Clear();

            foreach (var userId in userIds)
            {
                var airlineOperator = await _context.AirlineOperators.Where(e => e.UserId == userId).FirstOrDefaultAsync();

                if (airlineOperator == null)
                    throw new Exception($"No airline operator with id {userId} exists.");

                airline.Operators?.Add(airlineOperator);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<AirlineData> UpdateAirline(int id, Airline updatedAirline)
        {
            // Find airline to modify
            var airline = await _context.Airlines.Where(e => e.AirlineId == id).Include(e => e.Operators).ThenInclude(o => o.User).FirstOrDefaultAsync();

            if (airline == null)
                throw new Exception($"No airline with id {id} exists.");

            airline.AirlineName = updatedAirline.AirlineName;
            airline.PhoneNumber = updatedAirline.PhoneNumber;
            airline.Country = updatedAirline.Country;
            airline.EmailAddress = updatedAirline.EmailAddress;

            await _context.SaveChangesAsync();
            return new AirlineData
            {
                Id = airline.AirlineId,
                AirlineName = airline.AirlineName,
                Country = airline.Country,
                PhoneNumber = airline.PhoneNumber,
                EmailAddress = airline.EmailAddress,
                AirlineOperators = airline.Operators?.Select(e => new AirlineOperatorData
                {
                    Id = e.UserId,
                    FirstName = e.User.FirstName,
                    LastName = e.User.LastName,
                    Email = e.User.Email,
                    PhoneNumber = e.User.PhoneNumber,
                    Role = Enum.Parse<UserRole>("AirlineOperator"),
                    AirlineId = airline.AirlineId
                }).ToArray() ?? []
            };
        }

        public async Task<AirlineMetricsDTO> GetAirlineMetrics(int id)
        {
            var airline = await _context.Airlines.Where(e => e.AirlineId == id)
                .Include(e => e.Routes).ThenInclude(route => route.RouteSeatClasses)
                .Include(e => e.Routes).ThenInclude(route => route.Flights).ThenInclude(flight => flight.Airplane)
                .Include(e => e.Routes).ThenInclude(route => route.Reservations).ThenInclude(reservation => reservation.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).FirstOrDefaultAsync();

            if (airline == null)
                throw new Exception($"No airline with id {id} exists.");

            var currentDay = DateTime.Now;
            var lastDayOfMonth = currentDay.AddMonths(1).AddDays(currentDay.AddMonths(1).Day).Date;

            var monthlyFlights = airline.Routes != null ? airline.Routes.Where(e => e.DepartureTime < lastDayOfMonth).Aggregate(0, (total, currRoute) => total + currRoute.Flights.Count) : 0;

            var monthlyReservations = airline.Routes != null ? airline.Routes.Where(e => e.DepartureTime < lastDayOfMonth).Aggregate(0, (total, currRoute) => total + currRoute.Reservations.Count) : 0;

            var monthlyRevenue = airline.Routes != null ? airline.Routes.Where(e => e.DepartureTime < lastDayOfMonth).SelectMany(e => e.Reservations).Aggregate(0m, (currTotal, currReservation) =>
            {
                return currTotal + currReservation.TotalCost;
            }) : 0m;

            var flightsThisMonth = airline.Routes != null ? airline.Routes.SelectMany(route => route.Flights).Where(e => e.DepartureTime < lastDayOfMonth).Select(e => new SimplifiedFlightDataDTO
            {
                Id = e.FlightId,
                DepartureAirportCode = e.DepartureAirportCode,
                ArrivalAirportCode = e.ArrivalAirportCode,
                DepartureTime = e.DepartureTime,
                ArrivalTime = e.ArrivalTime,
                Duration = e.Duration,
                Delay = e.Delay,
                AirplaneName = e.Airplane.AirplaneBrand + " " + e.Airplane.AirplaneModel,
                RouteId = e.RouteId
            }).ToList() : null;

            return new AirlineMetricsDTO
            {
                MonthlyFlights = monthlyFlights,
                MonthlyReservations = monthlyReservations,
                MonthlyRevenue = monthlyRevenue,
                UpcomingFlights = flightsThisMonth
            };
        }
    }
}
