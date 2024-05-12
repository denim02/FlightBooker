using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs;
using FlightBooker.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly UserManager<AppUser> _userManager;

        public AuthController(IAuthenticationService authenticationService, UserManager<AppUser> userManager)
        {
            _authenticationService = authenticationService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] SignUpRequest signUpRequest)
        {
            var (isRegistered, error) = await _authenticationService.RegisterAsync(
                signUpRequest.FirstName,
                signUpRequest.LastName,
                signUpRequest.Email,
                signUpRequest.Username,
                signUpRequest.Password,
                signUpRequest.PhoneNumber
                );

            return isRegistered ?
                Ok(new FormValidationResponse
                {
                    IsSuccessful = true,
                    Entries = new Dictionary<string, string>
                    {
                        {"userId", (await _userManager.FindByNameAsync(signUpRequest.Username))!.Id}
                    }
                }) :
                BadRequest(new FormValidationResponse
                {
                    IsSuccessful = false,
                    Errors = new Dictionary<string, string[]>
                    {
                        { error.FieldName, [error.Error] }
                    }
                }
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LogInRequest loginRequest)
        {
            var (isSuccessful, error) = await _authenticationService.LoginAsync(loginRequest.Email, loginRequest.Password, loginRequest.RememberMe);

            if (isSuccessful)
            {
                var authenticatedUser = await _userManager.GetUserAsync(User);
                var role = (await _userManager.GetRolesAsync(authenticatedUser!)).FirstOrDefault("User");

                return Ok(new FormValidationResponse
                {
                    IsSuccessful = true,
                    Entries = new Dictionary<string, string>
                    {
                        { "userId", authenticatedUser!.Id },
                        { "role", role }
                    }
                });
            }

            if (error != null && error.Error == "You must verify your email before signing in.")
            {
                // Find user ID
                var userId = (await _userManager.FindByEmailAsync(loginRequest.Email)).Id;

                return BadRequest(new FormValidationResponse
                {
                    IsSuccessful = false,
                    Entries = new Dictionary<string, string>
                    {
                        { "userId", userId },
                    },
                    Errors = new Dictionary<string, string[]>
                    {
                        { error.FieldName, [error.Error] }
                    }
                });
            }

            return BadRequest(new FormValidationResponse
            {
                IsSuccessful = false,
                Errors = new Dictionary<string, string[]>
                {
                    { error.FieldName, [error.Error] }
                }
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            await _authenticationService.LogoutAsync();
            return Ok();
        }


        [HttpPost("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest confirmEmailRequest)
        {
            var (isVerified, error) = await _authenticationService.VerifyEmailAsync(confirmEmailRequest.UserId, confirmEmailRequest.ConfirmationToken);

            return isVerified ? Ok() : BadRequest(new FormValidationResponse
            {
                IsSuccessful = false,
                Errors = new Dictionary<string, string[]>
                {
                    { error.FieldName, [error.Error]}
                }
            });
        }

        [HttpPost("resendConfirmationEmail")]
        public async Task<IActionResult> ResendConfirmationEmail([FromBody] Data.Models.DTOs.ResendConfirmationEmailRequest req)
        {
            await _authenticationService.ResendVerificationEmailAsync(req.UserId);
            return Ok();
        }
    }
}
