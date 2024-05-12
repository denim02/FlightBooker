using FlightBooker.Server.Data;
using FlightBooker.Server.Data.Models;
using FlightBooker.Server.Services;
using FlightBooker.Server.Services.Airlines;
using FlightBooker.Server.Services.Airplanes;
using FlightBooker.Server.Services.Airports;
using FlightBooker.Server.Services.Complaints;
using FlightBooker.Server.Services.Reservations;
using FlightBooker.Server.Services.Routes;
using FlightBooker.Server.Services.Users;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FlightBooker.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Read the connection string from appsettings.json
            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

            #region Add services to the container
            builder.Services.AddDbContext<ApplicationDbContext>(
                options => options.UseMySql(
                    builder.Configuration.GetConnectionString("MySQLConnection"),
                    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySQLConnection"))
                    )
                .LogTo(Console.WriteLine, LogLevel.Information)
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()
                );

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                    options.LoginPath = "/auth/login";
                    options.AccessDeniedPath = "/auth/access-denied";
                    options.SlidingExpiration = true;
                });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdministratorRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("RequireAirlineOperatorRole", policy => policy.RequireRole("AirlineOperator"));
                options.AddPolicy("RequirePrivilegedRole", policy => policy.RequireRole("Admin", "AirlineOperator"));
                options.AddPolicy("RequireUserRole", policy => policy.RequireRole("User"));
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("SecurePolicy", internalBuilder =>
                {
                    internalBuilder.WithOrigins("https://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();

                    internalBuilder.WithOrigins("https://localhost:5174")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
            {
                // Email Settings
                options.SignIn.RequireConfirmedEmail = true;
                options.User.RequireUniqueEmail = true;

                // Password Settings
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddTransient<IEmailService, EmailService>();
            builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAirplanesService, AirplanesService>();
            builder.Services.AddScoped<IAirportsService, AirportsService>();
            builder.Services.AddScoped<IAirlinesService, AirlinesService>();
            builder.Services.AddScoped<IComplaintsService, ComplaintsService>();
            builder.Services.AddScoped<IRoutesService, RoutesService>();
            builder.Services.AddScoped<IReservationsService, ReservationsService>();

            #endregion

            var app = builder.Build();

            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("SecurePolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            using (var scope = app.Services.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                await SeedRolesAsync(roleManager);
            }

            if (false)
                SampleData.Initialize(app.Services);

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            var roles = Enum.GetNames<UserRole>();

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }

    }
}