using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Users;
using FlightBooker.Server.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlightBooker.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly UserManager<AppUser> _userManager;

        public UsersController(IUserService userService, UserManager<AppUser> userManager)
        {
            _userService = userService;
            _userManager = userManager;
        }

        // GET: /users
        [HttpGet]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await _userService.GetAllUsersData());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET /users/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(string id)
        {
            // Verify user identity
            // If the user is not an admin or does not have the same id as the requested user, decline the request
            var user = await _userManager.FindByIdAsync(id);

            if (User.Identity.Name != user.UserName && !User.IsInRole("Admin"))
            {
                return Unauthorized();
            }

            try
            {
                return Ok(await _userService.GetUserDataById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // PUT /users/5
        [HttpPut("{id}")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> Put(string id, [FromBody] ChangeUserRoleRequest changeUserRoleRequest)
        {
            // Check if the new user role is admin
            // If yes, decline the request
            if (changeUserRoleRequest.UserRole == UserRole.Admin)
            {
                return BadRequest("Cannot set a user's role to administrator.");
            }

            try
            {
                return Ok(await _userService.UpdateUserRole(id, changeUserRoleRequest.UserRole));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /users/count
        [HttpGet("count")]
        [Authorize("RequireAdministratorRole")]
        public async Task<IActionResult> GetUsersCount()
        {
            try
            {
                return Ok(await _userService.GetTotalUserCount());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
