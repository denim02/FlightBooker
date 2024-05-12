using FlightBooker.Server.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SeatClass>()
                .HasIndex(e => e.ClassName)
                .IsUnique();
        }

        public DbSet<Models.Airline> Airlines { get; set; }
        public DbSet<Models.AirlineOperator> AirlineOperators { get; set; }
        public DbSet<Models.Airport> Airports { get; set; }
        public DbSet<Models.Airplane> Airplanes { get; set; }
        public DbSet<Models.SeatClass> SeatClasses { get; set; }
        public DbSet<Models.AirplaneSeat> AirplaneSeats { get; set; }
        public DbSet<Models.Route> Routes { get; set; }
        public DbSet<Models.RouteSeatClass> RouteSeatClasses { get; set; }
        public DbSet<Models.Flight> Flights { get; set; }
        public DbSet<Models.FlightSeat> FlightSeats { get; set; }
        public DbSet<Models.Reservation> Reservations { get; set; }
        public DbSet<Models.Complaint> Complaints { get; set; }
    }
}
