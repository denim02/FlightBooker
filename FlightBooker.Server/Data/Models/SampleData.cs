using FlightBooker.Server.Data.Models.DTOs.Airplanes;
using FlightBooker.Server.Data.Models.DTOs.Routes;
using FlightBooker.Server.Services.Routes;
using Microsoft.AspNetCore.Identity;

namespace FlightBooker.Server.Data.Models
{
    public class SampleData
    {
        public static async void Initialize(IServiceProvider serviceProvider)
        {
            using (var serviceScope = serviceProvider.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                var userManager = serviceScope.ServiceProvider.GetService<UserManager<AppUser>>();
                var routesService = serviceScope.ServiceProvider.GetService<IRoutesService>();

                // Seed user data
                var adminUser = new AppUser
                {
                    UserName = "admin",
                    Email = "admin@gmail.com",
                    FirstName = "Admin",
                    LastName = "Admin",
                    EmailConfirmed = true,
                };
                var airlineOperatorUser = new AppUser
                {
                    UserName = "airlineoperator",
                    Email = "airline@gmail.com",
                    FirstName = "Airline Op",
                    LastName = "Airline Op",
                    EmailConfirmed = true
                };
                var regularUser = new AppUser
                {
                    UserName = "dnm201",
                    Email = "dnm201@aubg.edu",
                    FirstName = "Deni",
                    LastName = "Mastori",
                    PhoneNumber = "+355682356123",
                    EmailConfirmed = true
                };

                await userManager.CreateAsync(adminUser, "Kokoro123!");
                await userManager.AddToRoleAsync(adminUser, "Admin");
                await userManager.CreateAsync(airlineOperatorUser, "Kokoro123!");
                await userManager.AddToRoleAsync(airlineOperatorUser, "AirlineOperator");
                await userManager.CreateAsync(regularUser, "Kokoro123!");
                await userManager.AddToRoleAsync(regularUser, "User");

                // Seed seat class data
                await context.SeatClasses.AddRangeAsync(
                    new SeatClass() { SeatClassId = 4, ClassName = "Economy" },
                    new SeatClass() { SeatClassId = 3, ClassName = "Premium Economy" },
                    new SeatClass() { SeatClassId = 2, ClassName = "Business" },
                    new SeatClass() { SeatClassId = 1, ClassName = "First Class" }
                );

                // Seed airports
                await context.Airports.AddRangeAsync(
                    new Airport() { AirportCode = "SOF", AirportName = "Sofia Airport", City = "Sofia", Country = "Bulgaria" },
                    new Airport() { AirportCode = "VIE", AirportName = "Vienna International Airport", City = "Vienna", Country = "Austria" },
                    new Airport() { AirportCode = "IST", AirportName = "Istanbul Airport", City = "Istanbul", Country = "Turkey" },
                    new Airport() { AirportCode = "TIA", AirportName = "Tirana International Airport", City = "Tirana", Country = "Albania" },
                    new Airport() { AirportCode = "BER", AirportName = "Berlin Brandenburg Airport", City = "Berlin", Country = "Germany" }
                );

                // Seed airplane and airplane seat data
                var seatClassMappings = new RowSeatClassMapping[]
                {
                    new RowSeatClassMapping { SeatClass = 1, Rows = [1,2,3] },
                    new RowSeatClassMapping{ SeatClass = 2, Rows = [4,5,6] },
                    new RowSeatClassMapping{ SeatClass = 3, Rows = [7,8,9,10,11,12,13,14,15] },
                    new RowSeatClassMapping { SeatClass = 4, Rows = [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30] }
                };

                Airplane[] planes = [
                    new Airplane() { AirplaneId = 1, AirplaneBrand = "Boeing", AirplaneModel = "737", NrColumns = 6, NrRows = 30 },
                    new Airplane() { AirplaneId = 2, AirplaneBrand = "Airbus", AirplaneModel = "A320", NrColumns = 4, NrRows = 30 },
                    new Airplane() { AirplaneId = 3, AirplaneBrand = "Boeing", AirplaneModel = "747", NrColumns = 7, NrRows = 30 }
                ];

                foreach (var plane in planes)
                {
                    plane.AirplaneSeats = plane.GenerateAirplaneSeats(seatClassMappings);
                }

                await context.Airplanes.AddRangeAsync(planes);

                // Seed airlines
                await context.Airlines.AddRangeAsync(
                    new Airline() { AirlineId = 1, AirlineName = "Bulgaria Air", Country = "Bulgaria", EmailAddress = "bulgariaair@gmail.com", PhoneNumber = "+359872351413" },
                    new Airline() { AirlineId = 2, AirlineName = "Lufthansa", Country = "Austria", EmailAddress = "lufthansa@gmail.com", PhoneNumber = "+359872351413" },
                    new Airline() { AirlineId = 3, AirlineName = "Turkish Airlines", Country = "Turkey", EmailAddress = "turkishairlines@gmail.com", PhoneNumber = "+359872351413" }
                );

                // Seed airline operators
                await context.AirlineOperators.AddAsync(
                    new AirlineOperator { AirlineId = 2, UserId = airlineOperatorUser.Id }
                );

                await context.SaveChangesAsync();

                // Seed routes
                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 2,
                    IsTransit = true,
                    Repeating = true,
                    Frequency = "monthly",
                    Flights = new List<FlightCreateDTO>
                    {
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "TIA",
                            ArrivalAirportCode = "VIE",
                            DepartureTime = new DateTime(2024, 4, 10, 20, 30, 00),
                            ArrivalTime = new DateTime(2024, 4, 10, 22, 30, 00),
                            AirplaneId = 1
                        },
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "VIE",
                            ArrivalAirportCode = "SOF",
                            DepartureTime = new DateTime(2024, 4, 11, 00, 00, 00),
                            ArrivalTime = new DateTime(2024, 4, 11, 03, 30, 00),
                            AirplaneId = 1
                        },
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "SOF",
                            ArrivalAirportCode = "TIA",
                            DepartureTime = new DateTime(2024, 4, 11, 4, 00, 00),
                            ArrivalTime = new DateTime(2024, 4, 11, 5, 30, 0),
                            AirplaneId = 2
                        }
                    },
                    Prices = new Dictionary<int, decimal>
                    {
                        {1, 400 },
                        {4, 100 },
                        {3, 200 },
                        {2, 300 },
                    }
                });

                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 1,
                    IsTransit = false,
                    Repeating = false,
                    Flights = new List<FlightCreateDTO>
                        {
                            new FlightCreateDTO
                            {
                                DepartureAirportCode = "SOF",
                                ArrivalAirportCode = "IST",
                                DepartureTime = new DateTime(2024, 4, 12, 8, 0, 0),
                                ArrivalTime = new DateTime(2024, 4, 12, 10, 30, 0),
                                AirplaneId = 1
                            }
                        },
                    Prices = new Dictionary<int, decimal>
                        {
                            {1, 350 },
                            {4, 120 },
                            {3, 200 },
                            {2, 280 }
                        }
                });

                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 2,
                    IsTransit = true,
                    Repeating = true,
                    Frequency = "weekly",
                    Flights = new List<FlightCreateDTO>
                    {
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "TIA",
                            ArrivalAirportCode = "BER",
                            DepartureTime = new DateTime(2024, 4, 13, 10, 0, 0),
                            ArrivalTime = new DateTime(2024, 4, 13, 18, 30, 0),
                            AirplaneId = 2
                        },
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "BER",
                            ArrivalAirportCode = "VIE",
                            DepartureTime = new DateTime(2024, 4, 13, 20, 0, 0),
                            ArrivalTime = new DateTime(2024, 4, 13, 22, 30, 0),
                            AirplaneId = 2
                        }
                    },
                    Prices = new Dictionary<int, decimal>
                    {
                        {1, 450 },
                        {4, 150 },
                        {3, 280 },
                        {2, 380 }
                    }
                });

                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 2,
                    IsTransit = false,
                    Repeating = false,
                    Flights = new List<FlightCreateDTO>
                    {
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "VIE",
                            ArrivalAirportCode = "SOF",
                            DepartureTime = new DateTime(2024, 4, 14, 12, 0, 0),
                            ArrivalTime = new DateTime(2024, 4, 14, 14, 30, 0),
                            AirplaneId = 3
                        }
                    },
                    Prices = new Dictionary<int, decimal>
                    {
                        {1, 400 },
                        {4, 130 },
                        {3, 250 },
                        {2, 320 }
                    }
                });

                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 3,
                    IsTransit = false,
                    Repeating = false,
                    Flights = new List<FlightCreateDTO>
                    {
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "IST",
                            ArrivalAirportCode = "TIA",
                            DepartureTime = new DateTime(2024, 4, 15, 16, 0, 0),
                            ArrivalTime = new DateTime(2024, 4, 15, 17, 30, 0),
                            AirplaneId = 1
                        }
                    },
                    Prices = new Dictionary<int, decimal>
                    {
                        {1, 300 },
                        {4, 100 },
                        {3, 180 },
                        {2, 250 }
                    }
                });


                await routesService.CreateRoute(new DTOs.Routes.RouteCreateDTO
                {
                    AirlineId = 1,
                    IsTransit = false,
                    Repeating = false,
                    Flights = new List<FlightCreateDTO>
                    {
                        new FlightCreateDTO
                        {
                            DepartureAirportCode = "BER",
                            ArrivalAirportCode = "VIE",
                            DepartureTime = new DateTime(2024, 4, 17, 8, 0, 0),
                            ArrivalTime = new DateTime(2024, 4, 17, 10, 30, 0),
                            AirplaneId = 1
                        }
                    },
                    Prices = new Dictionary<int, decimal>
                    {
                        {1, 350 },
                        {4, 120 },
                        {3, 220 },
                        {2, 300 }
                    }
                });

                // Seed complaints
                await context.Complaints.AddRangeAsync(new List<Complaint>
                {
                    new Complaint
                    {
                        DateIssued = new DateTime(),
                        Description = "This is a sample complaint.",
                        IsResolved = false,
                        ComplainantId = regularUser.Id,
                    },
                    new Complaint
                    {
                        DateIssued = new DateTime(2024, 04, 04, 22, 30, 00),
                        Description = "The second complaint.",
                        ComplainantId = airlineOperatorUser.Id,
                    }
                });

                await context.SaveChangesAsync();
            }
        }
    }
}
