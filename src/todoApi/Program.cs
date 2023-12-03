using Azure.Identity;
using Microsoft.EntityFrameworkCore;
using todoApi.Models;
using Microsoft.AspNetCore.Identity;
using todoApi.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using todoApi.Providers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITodoListRepository, TodoListRepository>();
builder.Services.AddScoped<IUserDetails, UserDetails>();

var configBuilder = new ConfigurationBuilder()
    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

var configuration = configBuilder.Build();
var dbSettings = configuration.GetSection("DBSettings");
var dbPlatform = dbSettings.GetSection("Platform").Value;

Console.WriteLine($"Platform is {dbPlatform}");

builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder =>
{
    if (dbPlatform.Equals("MySQL", StringComparison.OrdinalIgnoreCase))
    {
        string connectionString = dbSettings.GetSection("MySqlConnection").Value;
        Console.WriteLine($"The connection string is {connectionString}");
        optionsBuilder.UseMySQL(connectionString);
    }
    else if (dbPlatform.Equals("COSMOS", StringComparison.OrdinalIgnoreCase))
    {
        bool useLocalCosmos = dbSettings.GetValue<bool>("UseLocalCosmos");
        if (useLocalCosmos)
        {
            string connectionString = dbSettings.GetSection("CosmosLocalConnection").Value;
            optionsBuilder.UseCosmos(connectionString, "Todo", dbOptions =>
            {
                dbOptions.ConnectionMode(Microsoft.Azure.Cosmos.ConnectionMode.Gateway);
                dbOptions.HttpClientFactory(() =>
                {
                    HttpMessageHandler httpMessageHandler = new HttpClientHandler()
                    {
                        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                    };

                    return new HttpClient(httpMessageHandler);
                });
            });
        }
        else
        {
            string cosmosEndpoint = dbSettings.GetSection("CosmosRemoteConnection").Value;
            string managedIdentity = dbSettings.GetSection("ManagedIdentityClientId").Value;
            DefaultAzureCredentialOptions azureCredentialOptions = new DefaultAzureCredentialOptions()
            {
                ManagedIdentityClientId = managedIdentity
            };

            Azure.Core.TokenCredential tokenCredential = new DefaultAzureCredential(azureCredentialOptions);
            optionsBuilder.UseCosmos(cosmosEndpoint, tokenCredential, "Todo");
        }
    }
    else
    {
        throw new ApplicationException($"Didn't specify a valid db platform! Received: '{dbPlatform}'");
    }
});

// tells authentication code that our identity is ApplicationUser
// and that we will store them in the application db context
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddUserStore<CosmosUserStore>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var jwtSection = configuration.GetSection("JWTSettings");
string validJWTAudience = jwtSection.GetSection("JWTValidAudience").Value;
string validJWTIssuer = jwtSection.GetSection("JWTValidIssuer").Value;
string jwtSigningKey = jwtSection.GetSection("JWTSecret").Value;

Console.WriteLine($"{validJWTAudience}\n{validJWTIssuer}\n{validJWTAudience}");

builder.Services.AddSingleton<IJWTConfiguration>(new JWTConfiguration(validJWTAudience, validJWTIssuer, jwtSigningKey));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = validJWTAudience,
        ValidIssuer = validJWTIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey))
    };
});

var app = builder.Build();

app.UseAuthentication();

app.UseRouting();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    Console.WriteLine("The is development!!");
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
