using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Service;
using Backend.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly TokenService _token;
        public AuthController(AuthDbContext context, TokenService token)
        {
            _context = context;
            _token = token;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO register){
            // return new UserDTO{};
            if (await _context.Users.AnyAsync(u => u.UserName == register.UserName))
            {
                return BadRequest("UserName is already taken");


            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == register.Email))
            {
                return BadRequest("Email is already registered");
            }

            // Create new user
            var user = new User
            {
                UserName = register.UserName,
                Email = register.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password)
            };

            // Check if this is the first user, if so, make them an Admin
            if (!await _context.Users.AnyAsync())
            {
                user.Role = "Admin";
            }

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Return user DTO with token
            return new UserDTO
            
            {
                // Id = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role
            };
            
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO loginDto)
        {
            // Find user by username
            var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == loginDto.UserName);

            // Check if user exists
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // Generate JWT token
            var token = _token.GenerateToken(user);

            // Return token and user information
            return Ok(new
            {
                Token = token,
                User = new UserDTO
                {
                    // Id = user.UserId,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }
    }
}
