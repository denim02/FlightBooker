using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Routes;
using FlightBooker.Server.Services.Email.Templates;
using Microsoft.EntityFrameworkCore;
using Route = FlightBooker.Server.Data.Models.Route;

namespace FlightBooker.Server.Services.Routes
{
    public class RoutesService : IRoutesService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public RoutesService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }


        public async Task CreateRoute(RouteCreateDTO routeData)
        {
            await ValidateRouteData(routeData);

            // Create new flights and routes
            var routes = new List<Route>();

            if (!routeData.Repeating)
            {
                // Create route
                var route = new Route
                {
                    AirlineId = routeData.AirlineId,
                    DepartureAirportCode = routeData.Flights.First().DepartureAirportCode,
                    ArrivalAirportCode = routeData.Flights.Last().ArrivalAirportCode,
                    DepartureTime = routeData.Flights.First().DepartureTime.ToLocalTime(),
                    ArrivalTime = routeData.Flights.Last().ArrivalTime.ToLocalTime(),
                    IsRepeating = routeData.Repeating,
                    Frequency = routeData.Frequency == null ? null : Enum.Parse<RouteFrequency>($"{char.ToUpper(routeData.Frequency[0])}{routeData.Frequency[1..]}"),
                    RouteGroupId = _context.Routes.OrderBy(e => e.RouteGroupId).LastOrDefault()?.RouteGroupId + 1 ?? 1,
                };

                // Create associated flights
                var flights = routeData.Flights.Select(e =>
                {
                    var airplane = _context.Airplanes.Where(a => a.AirplaneId == e.AirplaneId).Include(a => a.AirplaneSeats).FirstOrDefault();

                    if (airplane == null)
                    {
                        throw new Exception($"No airplane with id {airplane.AirplaneId} was found.");
                    }

                    var newFlight = new Flight
                    {
                        AirplaneId = e.AirplaneId,
                        DepartureAirportCode = e.DepartureAirportCode,
                        ArrivalAirportCode = e.ArrivalAirportCode,
                        DepartureTime = e.DepartureTime.ToLocalTime(),
                        ArrivalTime = e.ArrivalTime.ToLocalTime()
                    };

                    newFlight.FlightSeats = newFlight.GenerateFlightSeats(airplane);

                    return newFlight;
                }).ToList();

                // Create route seat classes for ticket prices
                var routeSeatClasses = routeData.Prices.Select(e => new RouteSeatClass
                {
                    RouteId = route.RouteId,
                    SeatClassId = e.Key,
                    Price = e.Value
                }).ToArray();

                route.Flights = flights;
                route.RouteSeatClasses = routeSeatClasses;

                routes.Add(route);
            }
            else
            {
                var originalDepartureTime = routeData.Flights.First().DepartureTime;
                var departureTime = originalDepartureTime;
                var travelTime = routeData.Flights.Last().ArrivalTime - originalDepartureTime;
                var multiplier = 0;
                TimeSpan repetitionIncrement;

                switch (routeData.Frequency)
                {
                    case "daily":
                        repetitionIncrement = TimeSpan.FromDays(1);
                        break;
                    case "weekly":
                        repetitionIncrement = TimeSpan.FromDays(7);
                        break;
                    case "monthly":
                        repetitionIncrement = originalDepartureTime.AddMonths(1).Subtract(originalDepartureTime);
                        break;
                    case "yearly":
                        repetitionIncrement = originalDepartureTime.AddYears(1).Subtract(originalDepartureTime);
                        break;
                    default:
                        throw new Exception("Invalid frequency value.");
                }

                while (departureTime < originalDepartureTime.AddYears(1))
                {
                    var route = new Route
                    {
                        AirlineId = routeData.AirlineId,
                        DepartureAirportCode = routeData.Flights.First().DepartureAirportCode,
                        ArrivalAirportCode = routeData.Flights.Last().ArrivalAirportCode,
                        DepartureTime = departureTime.ToLocalTime(),
                        ArrivalTime = (departureTime + travelTime).ToLocalTime(),
                        IsRepeating = routeData.Repeating,
                        Frequency = routeData.Frequency == null ? null : Enum.Parse<RouteFrequency>($"{char.ToUpper(routeData.Frequency[0])}{routeData.Frequency[1..]}"),
                        RouteGroupId = _context.Routes.OrderBy(e => e.RouteGroupId).LastOrDefault()?.RouteGroupId + 1 ?? 1,
                    };

                    var routeFlights = routeData.Flights.Select(e =>
                    {
                        var airplane = _context.Airplanes.Where(a => a.AirplaneId == e.AirplaneId).Include(a => a.AirplaneSeats).FirstOrDefault();


                        if (airplane == null)
                        {
                            throw new Exception($"No airplane with id {airplane.AirplaneId} was found.");
                        }

                        var newFlight = new Flight
                        {
                            AirplaneId = e.AirplaneId,
                            DepartureAirportCode = e.DepartureAirportCode,
                            ArrivalAirportCode = e.ArrivalAirportCode,
                            DepartureTime = (e.DepartureTime + repetitionIncrement * multiplier).ToLocalTime(),
                            ArrivalTime = (e.ArrivalTime + repetitionIncrement * multiplier).ToLocalTime(),
                        };

                        newFlight.FlightSeats = newFlight.GenerateFlightSeats(airplane);

                        return newFlight;
                    }).ToList();

                    // Create route seat classes for ticket prices
                    var routeSeatClasses = routeData.Prices.Select(e => new RouteSeatClass
                    {
                        RouteId = route.RouteId,
                        SeatClassId = e.Key,
                        Price = e.Value
                    }).ToArray();

                    route.Flights = routeFlights;
                    route.RouteSeatClasses = routeSeatClasses;

                    routes.Add(route);

                    departureTime += repetitionIncrement;
                    multiplier++;
                }
            }

            await _context.Routes.AddRangeAsync(routes);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoute(int id)
        {
            // Check if an route with that id exists
            var route = await _context.Routes.FindAsync(id);

            if (route == null)
                throw new Exception($"No route with route code {id} exists.");

            _context.Routes.Remove(route);
            await _context.SaveChangesAsync();
        }

        public async Task<RouteDataDTO> GetRoute(int id)
        {
            var r = await _context.Routes.Where(r => r.RouteId == id).Include(r => r.Flights).Include(e => e.RouteSeatClasses).FirstOrDefaultAsync();

            if (r == null)
                throw new Exception($"No route with route code {id} exists.");

            return new RouteDataDTO
            {
                Id = r.RouteId,
                AirlineId = r.AirlineId,
                IsTransit = r.Flights.Count > 1,
                Repeating = r.IsRepeating,
                Frequency = r.Frequency.HasValue ? Enum.GetName<RouteFrequency>(r.Frequency.Value) : null,
                DepartureAirportCode = r.DepartureAirportCode,
                ArrivalAirportCode = r.ArrivalAirportCode,
                DepartureTime = r.DepartureTime,
                ArrivalTime = r.ArrivalTime,
                HasReservations = r.Reservations.Count != 0,
                FlightCount = r.Flights.Count,
                Prices = new Dictionary<string, decimal> {
                    {"firstClass", r.RouteSeatClasses.Where(e => e.SeatClassId == 1).First().Price},
                    {"business", r.RouteSeatClasses.Where(e => e.SeatClassId == 2).First().Price},
                    {"premiumEconomy", r.RouteSeatClasses.Where(e => e.SeatClassId == 3).First().Price},
                    {"economy", r.RouteSeatClasses.Where(e => e.SeatClassId == 4).First().Price}
                },
                RouteGroupId = r.RouteGroupId
            };
        }

        public async Task<RouteBookingDataDTO> GetRouteBookingData(int id)
        {
            var route = await _context.Routes.Where(r => r.RouteId == id).Include(r => r.Flights).ThenInclude(flight => flight.FlightSeats).Include(r => r.RouteSeatClasses).Include(r => r.Airline).FirstOrDefaultAsync();

            if (route == null)
                throw new Exception($"No route with route code {id} exists.");

            var routeBookingData = new RouteBookingDataDTO
            {
                Id = route.RouteId,
                AirlineName = route.Airline.AirlineName,
                DepartureAirportCode = route.DepartureAirportCode,
                ArrivalAirportCode = route.ArrivalAirportCode,
                DepartureTime = route.DepartureTime,
                ArrivalTime = route.ArrivalTime,
                Flights = route.Flights.Select(f => new FlightBookingDataDTO
                {
                    FlightId = f.FlightId,
                    DepartureAirportCode = f.DepartureAirportCode,
                    ArrivalAirportCode = f.ArrivalAirportCode,
                    DepartureTime = f.DepartureTime,
                    ArrivalTime = f.ArrivalTime,
                    AirplaneId = f.AirplaneId,
                    Duration = (int)Math.Round(f.Duration.TotalMinutes),
                    Delay = f.Delay.HasValue ? (int)Math.Round(f.Delay.Value.TotalMinutes) : 0,
                    Seats = f.FlightSeats.Select(seat => new FlightSeatDataDTO
                    {
                        FlightSeatId = seat.FlightSeatId,
                        AirplaneSeatId = seat.AirplaneSeatId,
                        IsReserved = seat.ReservationId != null,
                    }).ToList()
                }).ToList(),
                Prices = new Dictionary<string, decimal> {
                    {"firstClass", route.RouteSeatClasses.Where(e => e.SeatClassId == 1).First().Price},
                    {"business", route.RouteSeatClasses.Where(e => e.SeatClassId == 2).First().Price},
                    {"premiumEconomy", route.RouteSeatClasses.Where(e => e.SeatClassId == 3).First().Price},
                    {"economy", route.RouteSeatClasses.Where(e => e.SeatClassId == 4).First().Price}
                },
            };

            return routeBookingData;
        }

        public async Task<ICollection<RouteDataDTO>> GetAllRoutes()
        {
            return await _context.Routes.Include(r => r.Flights).Include(r => r.RouteSeatClasses).Include(r => r.Reservations).Select(r => new RouteDataDTO
            {
                Id = r.RouteId,
                AirlineId = r.AirlineId,
                IsTransit = r.Flights.Count > 1,
                Repeating = r.IsRepeating,
                Frequency = r.Frequency.HasValue ? Enum.GetName<RouteFrequency>(r.Frequency.Value) : null,
                DepartureAirportCode = r.DepartureAirportCode,
                ArrivalAirportCode = r.ArrivalAirportCode,
                DepartureTime = r.DepartureTime,
                ArrivalTime = r.ArrivalTime,
                HasReservations = r.Reservations.Count != 0,
                FlightCount = r.Flights.Count,
                Prices = new Dictionary<string, decimal> {
                    {"firstClass", r.RouteSeatClasses.Where(e => e.SeatClassId == 1).First().Price},
                    {"business", r.RouteSeatClasses.Where(e => e.SeatClassId == 2).First().Price},
                    {"premiumEconomy", r.RouteSeatClasses.Where(e => e.SeatClassId == 3).First().Price},
                    {"economy", r.RouteSeatClasses.Where(e => e.SeatClassId == 4).First().Price}
                },
                RouteGroupId = r.RouteGroupId

            }).ToListAsync();
        }

        public async Task<ICollection<RouteSearchResultDTO>> SearchRoutes(RouteSearchDTO searchParams)
        {
            // Validate that return data is present if isRoundTrip is set to true
            if (searchParams.IsRoundTrip && !searchParams.ReturnDate.HasValue)
                throw new Exception("A return date must be specified if you are searching for a round trip route.");

            var routes = _context.Routes.Include(r => r.Airline).Include(r => r.Flights).ThenInclude(flight => flight.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).Include(r => r.RouteSeatClasses).Include(r => r.Reservations).Where(r => r.DepartureAirportCode == searchParams.DepartureAirportCode).Where(r => r.DepartureTime.Date == searchParams.DepartureDate.Date).AsQueryable();

            if (searchParams.DirectFlightsOnly && searchParams.IsRoundTrip)
                routes = routes.Where(r => r.Flights.Count == 2);
            if (searchParams.DirectFlightsOnly && !searchParams.IsRoundTrip)
                routes = routes.Where(r => r.Flights.Count == 1);
            if (searchParams.IsRoundTrip)
                routes = routes.Where(r => r.Flights.Any(flight => flight.ArrivalAirportCode == searchParams.ArrivalAirportCode) && r.ArrivalAirportCode == searchParams.DepartureAirportCode && r.ArrivalTime.Date == searchParams.ReturnDate!.Value.Date);
            else
                routes = routes.Where(r => r.ArrivalAirportCode == searchParams.ArrivalAirportCode);
            if (searchParams.CabinClass != null)
            {
                routes = routes.Where(r => r.Flights.All(flight =>
        flight.FlightSeats
            .Where(flightSeat => flightSeat.AirplaneSeat.SeatClassId == searchParams.CabinClass.Value && flightSeat.ReservationId == null)
            .Count() >= searchParams.Seats));
            }
            else
            {
                routes = routes.Where(r => r.Flights.All(flight =>
        flight.FlightSeats
            .Where(flightSeat => flightSeat.ReservationId == null)
            .Count() >= searchParams.Seats));
            }

            return (await routes.ToListAsync()).Select(r => new RouteSearchResultDTO
            {
                Id = r.RouteId,
                DepartureAirportCode = r.DepartureAirportCode,
                ArrivalAirportCode = r.ArrivalAirportCode,
                PricePerSeat = r.RouteSeatClasses.Where(routeSeatClass => routeSeatClass.SeatClassId == (searchParams.CabinClass.HasValue ? searchParams.CabinClass.Value : 4)).First().Price,
                DepartureTime = r.DepartureTime,
                ArrivalTime = r.ArrivalTime,
                Duration = (int)Math.Round(r.Flights.Sum(flight => flight.Duration.TotalMinutes)),
                AirlineName = r.Airline.AirlineName,
                Stops = r.Flights.Count,
                AvailableSeats = r.Flights.Min(flight => flight.FlightSeats.Count(flightSeat => flightSeat.ReservationId == null)),
                Flights = r.Flights.Select(flight => new FlightSearchResultDTO
                {
                    Id = flight.FlightId,
                    DepartureAirportCode = flight.DepartureAirportCode,
                    ArrivalAirportCode = flight.ArrivalAirportCode,
                    DepartureTime = flight.DepartureTime,
                    ArrivalTime = flight.ArrivalTime,
                    Duration = (int)Math.Round(flight.Duration.TotalMinutes),
                    Delay = flight.Delay.HasValue ? (int)Math.Round(flight.Delay.Value.TotalMinutes) : null
                }).ToList()
            }).ToList();
        }

        public async Task<ICollection<RouteDataDTO>> GetAllRoutesForAirline(int id)
        {
            var airline = await _context.Airlines.FindAsync(id);

            if (airline == null)
                throw new Exception($"No airline with id {id} was found.");

            return await _context.Routes.Where(e => e.AirlineId == id).Include(e => e.Flights).Include(e => e.RouteSeatClasses).Include(e => e.Reservations).Select(r => new RouteDataDTO
            {
                Id = r.RouteId,
                AirlineId = r.AirlineId,
                IsTransit = r.Flights.Count > 1,
                Repeating = r.IsRepeating,
                Frequency = r.Frequency.HasValue ? Enum.GetName<RouteFrequency>(r.Frequency.Value) : null,
                DepartureAirportCode = r.DepartureAirportCode,
                ArrivalAirportCode = r.ArrivalAirportCode,
                DepartureTime = r.DepartureTime,
                ArrivalTime = r.ArrivalTime,
                HasReservations = r.Reservations.Any(),
                FlightCount = r.Flights.Count,
                Prices = new Dictionary<string, decimal> {
                    {"firstClass", r.RouteSeatClasses.Where(e => e.SeatClassId == 1).First().Price},
                    {"business", r.RouteSeatClasses.Where(e => e.SeatClassId == 2).First().Price},
                    {"premiumEconomy", r.RouteSeatClasses.Where(e => e.SeatClassId == 3).First().Price},
                    {"economy", r.RouteSeatClasses.Where(e => e.SeatClassId == 4).First().Price}
                },
                RouteGroupId = r.RouteGroupId
            }).ToListAsync();
        }


        private async Task ValidateRouteData(RouteCreateDTO routeData)
        {
            // Perform additional validations 
            // Check if the given frequency is either daily, monthly, weekly, or yearly
            if (routeData.Repeating != false && routeData.Frequency != "daily" && routeData.Frequency != "monthly" && routeData.Frequency != "weekly" && routeData.Frequency != "yearly")
                throw new Exception("Frequency must be either daily, monthly, weekly, or yearly.");

            // Check if the route is set as direct, but has more than one flight
            if (!routeData.IsTransit && routeData.Flights.Count > 1)
                throw new Exception("Direct routes can only have one flight.");
            if (routeData.IsTransit && routeData.Flights.Count < 2)
                throw new Exception("Transit routes must have at least two flights.");

            // Check if an airline with the given id exists
            var airline = await _context.Airlines.FindAsync(routeData.AirlineId);
            if (airline == null)
                throw new Exception($"No airline with id {routeData.AirlineId} exists.");

            // Check if the provided airplane models and airport codes are valid
            // Also check if the departure airport of a connecting flight matches the arrival airport
            // of the previous flight.
            // Lastly, check if the all the dates are in chronological order.
            if (!routeData.IsTransit)
            {
                var flightData = routeData.Flights.ElementAt(0);

                var airplane = await _context.Airplanes.FindAsync(flightData.AirplaneId);

                if (airplane == null)
                    throw new Exception($"No airplane with id {flightData.AirplaneId} exists.");

                var departureAirport = await _context.Airports.FindAsync(flightData.DepartureAirportCode);

                if (departureAirport == null)
                    throw new Exception($"No airport with airport code {flightData.DepartureAirportCode} exists.");

                var arrivalAirport = await _context.Airports.FindAsync(flightData.ArrivalAirportCode);

                if (arrivalAirport == null)
                    throw new Exception($"No airport with airport code {flightData.ArrivalAirportCode} exists.");

                // Check if the departure date is before the arrival date
                if (flightData.DepartureTime >= flightData.ArrivalTime)
                    throw new Exception("Departure date must be before arrival date.");
            }
            else
            {
                for (var i = 0; i < routeData.Flights.Count - 1; i++)
                {
                    var flightData = routeData.Flights.ElementAt(i);

                    var airplane = await _context.Airplanes.FindAsync(flightData.AirplaneId);

                    if (airplane == null)
                        throw new Exception($"No airplane with id {flightData.AirplaneId} exists.");

                    var departureAirport = await _context.Airports.FindAsync(flightData.DepartureAirportCode);

                    if (departureAirport == null)
                        throw new Exception($"No airport with airport code {flightData.DepartureAirportCode} exists.");

                    var arrivalAirport = await _context.Airports.FindAsync(flightData.ArrivalAirportCode);

                    if (arrivalAirport == null)
                        throw new Exception($"No airport with airport code {flightData.ArrivalAirportCode} exists.");

                    // Check if the departure date is before the arrival date
                    if (flightData.DepartureTime >= flightData.ArrivalTime)
                        throw new Exception("Departure date must be before arrival date.");

                    // Check that airport codes match
                    if (flightData.ArrivalAirportCode != routeData.Flights.ElementAt(i + 1).DepartureAirportCode)
                        throw new Exception("The departure airport of a connecting flight must be the same as the arrival airport of the previous flight.");

                    // Check that dates are in chronological order
                    if (routeData.Flights.ElementAt(i + 1).DepartureTime <= flightData.ArrivalTime)
                        throw new Exception("Arrival/departure dates and times must be in chronological order");
                }
            }
        }

        public async Task<ICollection<SimplifiedFlightDataDTO>> GetAllFlights()
        {
            return await _context.Flights.Include(e => e.Airplane).Select(e => new SimplifiedFlightDataDTO
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
            }).ToListAsync();
        }

        public async Task<ICollection<SimplifiedFlightDataDTO>> GetAllFlightsForAirline(int id)
        {
            var airline = await _context.Airlines.FindAsync(id);

            if (airline == null)
                throw new Exception($"No airline with id {id} found.");

            return await _context.Flights.Include(e => e.Route).Where(e => e.Route.AirlineId == id).Include(e => e.Airplane).Select(e => new SimplifiedFlightDataDTO
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
            }).ToListAsync();
        }
        public async Task DeleteRouteGroup(int routeGroupId)
        {
            var routes = await _context.Routes.Where(e => e.RouteGroupId == routeGroupId).ToListAsync();

            if (routes.Count == 0)
                throw new Exception($"No route group with id {routeGroupId} found.");

            foreach (var route in routes)
            {
                _context.Routes.Remove(route);
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateFlightDelay(int id, double delay)
        {
            var flight = await _context.Flights.Where(e => e.FlightId == id).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.Reservation).ThenInclude(reservation => reservation.Client).FirstOrDefaultAsync();

            if (flight == null)
                throw new Exception($"No flight with id {id} found.");

            flight.Delay = TimeSpan.FromMinutes(delay);
            await _context.SaveChangesAsync();

            foreach (var user in flight.FlightSeats.Where(flightSeat => flightSeat.IsBooked).Select(e => e.Reservation!.Client))
            {
                _emailService.SendEmailAsync(new EmailData
                {
                    EmailToId = user.Email!,
                    EmailToName = user.FirstName + " " + user.LastName,
                    EmailSubject = $"Flight #{id} - Delay",
                    EmailTextBody = $"A flight you reserved (flight #{id}) has been delayed by {Math.Round(delay, 0)} minutes.",
                    EmailHtmlBody = FlightDelayTemplate.GenerateBody(id.ToString(), user.FirstName, flight.DepartureAirportCode, flight.ArrivalAirportCode, Math.Round(delay, 0), flight.DepartureTime + TimeSpan.FromMinutes(delay))
                });
            }
        }
    }
}
