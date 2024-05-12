using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;

namespace FlightBooker.Server.Services
{
    public interface IAuthenticationService
    {
        #region Basic Auth Operations (Signup/Login/Logout)
        Task<(bool IsRegistered, FieldError? Error)> RegisterAsync(string firstName, string lastName, string username, string email, string password, string phoneNumber);
        Task<(bool IsAuthenticated, FieldError? Error)> LoginAsync(string email, string password, bool rememberMe);
        Task LogoutAsync();
        #endregion

        #region Email Verification
        Task<(bool IsVerified, FieldError? Error)> VerifyEmailAsync(string userId, string token);
        Task SendVerificationEmailAsync(AppUser user);
        Task ResendVerificationEmailAsync(string email);
        #endregion
    }
}
