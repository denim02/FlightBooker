using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Reservations;
using FlightBooker.Server.Services.Email.Templates;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Reservations
{
    public class ReservationsService : IReservationsService
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public ReservationsService(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<int> CreateReservation(ReservationCreateDTO reservationData)
        {
            var user = await _context.Users.FindAsync(reservationData.ClientId);

            if (user == null)
                throw new Exception($"No user with id {reservationData.ClientId} was found");

            var route = await _context.Routes.FindAsync(reservationData.RouteId);
            if (route == null)
                throw new Exception($"No route with id {reservationData.RouteId} was found");

            var reservation = new Reservation
            {
                ClientId = reservationData.ClientId,
                RouteId = reservationData.RouteId,
                ReservationDate = DateTime.Now,
            };

            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();

            foreach (var flightSeat in reservationData.FlightSeats)
            {
                foreach (var airplaneSeatId in flightSeat.AirplaneSeatIds)
                {
                    var seat = _context.FlightSeats.Where(e => e.AirplaneSeatId == airplaneSeatId && e.FlightId == flightSeat.FlightId).FirstOrDefault();

                    if (seat == null)
                        throw new Exception($"No seat with flight id {flightSeat.FlightId} and seat id {airplaneSeatId} was found");

                    seat.ReservationId = reservation.ReservationId;
                }
            }

            await _context.SaveChangesAsync();

            // Send email to user with reservation details
            _emailService.SendEmailAsync(new EmailData
            {
                EmailToId = user.Email!,
                EmailToName = user.FirstName + " " + user.LastName,
                EmailSubject = $"Booking #{reservation.ReservationId} - Successful",
                EmailTextBody = $"You have successfully reserved seats for route {route.DepartureAirportCode} - {route.ArrivalAirportCode}.",
                EmailHtmlBody = BookingConfirmationTemplate.GenerateBody(reservation.ReservationId, user.FirstName, route.DepartureAirportCode, route.ArrivalAirportCode, route.DepartureTime, route.ArrivalTime)
            });

            return reservation.ReservationId;
        }

        public async Task<ReservationDataDTO> GetReservation(int id)
        {
            var reservation = await _context.Reservations.Where(e => e.ReservationId == id).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.Flight).Include(e => e.Route).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).FirstOrDefaultAsync();

            if (reservation == null)
                throw new Exception($"No reservation with id {id} was found.");

            return new ReservationDataDTO
            {
                Id = reservation.ReservationId,
                ReservationDate = reservation.ReservationDate,
                ClientId = reservation.ClientId,
                RouteId = reservation.RouteId,
                ReservationSeatsData = reservation.FlightSeats.GroupBy(seat => new { seat.FlightId, seat.Flight.AirplaneId }, seat => seat.AirplaneSeat.SeatRow.ToString() + seat.AirplaneSeat.SeatColumn, (key, reservedSeats) => new ReservationSeatDataDTO { FlightId = key.FlightId, AirplaneId = key.AirplaneId, ReservedSeats = reservedSeats }).ToArray()
            };
        }

        public async Task<ICollection<ReservationDataDTO>> GetAllReservations()
        {
            var reservations = await _context.Reservations.Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.Flight).Include(e => e.Route).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).ToListAsync();

            return reservations.Select(reservation => new ReservationDataDTO
            {
                Id = reservation.ReservationId,
                ReservationDate = reservation.ReservationDate,
                ClientId = reservation.ClientId,
                RouteId = reservation.RouteId,
                ReservationSeatsData = reservation.FlightSeats.GroupBy(seat => new { seat.FlightId, seat.Flight.AirplaneId }, seat => seat.AirplaneSeat.SeatRow.ToString() + seat.AirplaneSeat.SeatColumn, (key, reservedSeats) => new ReservationSeatDataDTO { FlightId = key.FlightId, AirplaneId = key.AirplaneId, ReservedSeats = reservedSeats }).ToArray()
            }).ToList();
        }

        public async Task<ICollection<ReservationDataDTO>> GetAllReservationsForAirline(int airlineId)
        {
            var reservations = await _context.Reservations.Include(e => e.Route).Where(e => e.Route.AirlineId == airlineId).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.Flight).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).ToListAsync();

            return reservations.Select(reservation => new ReservationDataDTO
            {
                Id = reservation.ReservationId,
                ReservationDate = reservation.ReservationDate,
                ClientId = reservation.ClientId,
                RouteId = reservation.RouteId,
                ReservationSeatsData = reservation.FlightSeats.GroupBy(seat => new { seat.FlightId, seat.Flight.AirplaneId }, seat => seat.AirplaneSeat.SeatRow.ToString() + seat.AirplaneSeat.SeatColumn, (key, reservedSeats) => new ReservationSeatDataDTO { FlightId = key.FlightId, AirplaneId = key.AirplaneId, ReservedSeats = reservedSeats }).ToArray()
            }).ToList();
        }

        public async Task<ICollection<ReservationClientDataDTO>> GetAllReservationsForClient(string clientId)
        {
            var reservations = await _context.Reservations.Where(e => e.ClientId == clientId).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.Flight).Include(e => e.Route).Include(e => e.FlightSeats).ThenInclude(flightSeat => flightSeat.AirplaneSeat).ToListAsync();

            return reservations.Select(reservation => new ReservationClientDataDTO
            {
                Id = reservation.ReservationId,
                ReservationDate = reservation.ReservationDate,
                DepartureTime = reservation.Route.DepartureTime,
                ArrivalTime = reservation.Route.ArrivalTime,
                RouteName = $"{reservation.Route.DepartureAirportCode} - {reservation.Route.ArrivalAirportCode}",
                ReservationSeatsData = reservation.FlightSeats.GroupBy(seat => new { seat.FlightId, seat.Flight.AirplaneId }, seat => seat.AirplaneSeat.SeatRow.ToString() + seat.AirplaneSeat.SeatColumn, (key, reservedSeats) => new ReservationSeatDataDTO { FlightId = key.FlightId, AirplaneId = key.AirplaneId, ReservedSeats = reservedSeats }).ToArray()
            }).ToList();
        }
    }
}
