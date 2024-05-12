using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Services.Email.Templates;
using Microsoft.AspNetCore.Identity;

namespace FlightBooker.Server.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailService _emailService;

        public AuthenticationService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
        }

        public async Task<(bool IsAuthenticated, FieldError? Error)> LoginAsync(string email, string password, bool rememberMe)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return (false, new FieldError { FieldName = "Email", Error = "Invalid email or password." });
            }

            var result = await _signInManager.PasswordSignInAsync(user, password, rememberMe, false);

            if (result.IsNotAllowed && !user.EmailConfirmed)
            {
                await ResendVerificationEmailAsync(user.Id);
                return (false, new FieldError { FieldName = "Email", Error = "You must verify your email before signing in." });
            }

            return (
                result.Succeeded, result.Succeeded ? null : new FieldError { FieldName = "Email", Error = "Invalid email or password." }
                );
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<(bool IsRegistered, FieldError? Error)> RegisterAsync(string firstName, string lastName, string email, string username, string password, string phoneNumber)
        {

            if (await _userManager.FindByEmailAsync(email) != null)
            {
                return (false, new FieldError { FieldName = "Email", Error = "An account with that email already exists." });
            }

            var user = new AppUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = username,
                PhoneNumber = phoneNumber
            };

            var registrationResult = await _userManager.CreateAsync(user, password);

            if (registrationResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                await SendVerificationEmailAsync(user);
                return (true, null);
            }
            else if (registrationResult.Errors.Any(e => e.Code == "DuplicateUserName"))
            {

                return (false, new FieldError { FieldName = "Username", Error = "An account with that username already exists." });
            }
            else
            {
                return (registrationResult.Succeeded, new FieldError
                {
                    FieldName = registrationResult.Errors.First().Code,
                    Error = registrationResult.Errors.First().Description
                });
            }
        }

        public async Task SendVerificationEmailAsync(AppUser user)
        {

            var verificationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var emailData = new EmailData
            {
                EmailToId = user.Email!,
                EmailToName = user.UserName!,
                EmailSubject = "Confirm Your Email",
                EmailTextBody = $"Thank you for your registration!\nPlease confirm your email by pasting the following token into the appropriate field in the website:\n{verificationToken}\nSafe travels!",
                EmailHtmlBody = ConfirmEmailTemplate.GenerateBody(verificationToken)
            };

            _emailService.SendEmailAsync(emailData);
        }

        public async Task ResendVerificationEmailAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null || user.EmailConfirmed) throw new InvalidOperationException();

            await SendVerificationEmailAsync(user);
        }

        public async Task<(bool IsVerified, FieldError? Error)> VerifyEmailAsync(string userId, string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return (false, new FieldError { FieldName = "GeneralError", Error = "An error occured. Please try logging in again." });

            if (user.EmailConfirmed)
                return (true, null);

            var result = await _userManager.ConfirmEmailAsync(user, token);

            return (
                result.Succeeded,
                result.Succeeded ? null : new FieldError
                {
                    FieldName = "ConfirmationToken",
                    Error = result.Errors.First().Description
                }
                );
        }

    }
}
