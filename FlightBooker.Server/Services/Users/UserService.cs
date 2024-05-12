using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Services.Users
{
    public class UserService : IUserService
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserService(UserManager<AppUser> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _context = dbContext;
        }

        public async Task<UserData> GetUserDataById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                throw new ArgumentException($"No user with id {id} exists");

            return new UserData
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = Enum.Parse<UserRole>((await _userManager.GetRolesAsync(user))[0])
            };
        }

        public async Task<ICollection<UserData>> GetAllUsersData()
        {
            if (!_userManager.Users.Any())
                throw new InvalidOperationException("No users exist.");

            // Add the roles for each user to the response objects
            var usersWithRoles = new List<UserData>();

            foreach (var user in _userManager.Users.ToList())
            {
                var role = (await _userManager.GetRolesAsync(user))[0];
                usersWithRoles.Add(new UserData
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = Enum.Parse<UserRole>((await _userManager.GetRolesAsync(user))[0])
                });
            }

            return usersWithRoles;
        }

        public async Task DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                throw new ArgumentException($"No user with id {id} exists");

            if ((await _userManager.GetRolesAsync(user)).Contains("Admin"))
                throw new InvalidOperationException("Cannot delete an administrator user.");

            await _userManager.DeleteAsync(user);
        }


        public async Task<UserData> UpdateUserRole(string id, UserRole newUserRole)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                throw new ArgumentException($"No user with id {id} exists");

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (currentRoles.Contains("Admin"))
                throw new InvalidOperationException("Cannot demote an administrator.");

            // Remove airline operator from the airlineOperators table
            if (currentRoles.Contains("AirlineOperator") && newUserRole != UserRole.AirlineOperator)
            {
                var airlineOperator = await _context.AirlineOperators.Where(e => e.UserId == id).FirstOrDefaultAsync();

                if (airlineOperator != null)
                {
                    _context.AirlineOperators.Remove(airlineOperator);
                    await _context.SaveChangesAsync();
                }
            }

            // Remove the user from all roles before adding them to the new role
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            // Add the new role
            await _userManager.AddToRoleAsync(user, newUserRole.ToString());

            if (newUserRole == UserRole.AirlineOperator && !currentRoles.Contains("AirlineOperator"))
            {

                await _context.AirlineOperators.AddAsync(new AirlineOperator { User = user, AirlineId = null });
                await _context.SaveChangesAsync();
            }

            return await GetUserDataById(id);
        }

        public async Task<int> GetTotalUserCount()
        {
            return await _userManager.Users.CountAsync();
        }
    }
}
