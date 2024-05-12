using FlightBooker.Server.Data.Models.DTOs.Reservations;

namespace FlightBooker.Server.Services.Reservations
{
    public interface IReservationsService
    {
        Task<ICollection<ReservationDataDTO>> GetAllReservations();
        Task<ReservationDataDTO> GetReservation(int id);
        Task<ICollection<ReservationDataDTO>> GetAllReservationsForAirline(int airlineId);
        Task<ICollection<ReservationClientDataDTO>>
            GetAllReservationsForClient(string clientId);
        Task<int> CreateReservation(ReservationCreateDTO reservationData);
    }
}
