using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FlightBooker.Server.Data.Models
{
    public enum UserRole { Admin, User, AirlineOperator };

    public class AppUser : IdentityUser
    {
        [PersonalData]
        [Required]
        public string FirstName { get; set; } = null!;

        [PersonalData]
        [Required]
        public string LastName { get; set; } = null!;

        public ICollection<AirlineOperator>? AirlineOperators { get; set; } = new List<AirlineOperator>();
    }
}
