using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Data.Models.DTOs.Users;

namespace FlightBooker.Server.Services.Users
{
    public interface IUserService
    {
        Task<ICollection<UserData>> GetAllUsersData();
        Task<UserData> GetUserDataById(string id);
        Task DeleteUser(string id);
        Task<UserData> UpdateUserRole(string id, UserRole newUserRole);
        Task<int> GetTotalUserCount();
    }
}
