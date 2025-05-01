// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;

// namespace backend.Controllers
// {

//     [Route("user")]
//     [ApiController]
//     [Authorize] // All endpoints require authentication
//     public class UserController : ControllerBase
//     {
//         private readonly AuthDbContext _context;

//         public UserController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         [HttpGet]
//         [HttpGet("getallusers")]
//         [Authorize(Policy = "RequireAdminRole")]
//         public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
//         {
//             var users = await _context.Users.ToListAsync();

//             // Map users to UserDTO
//             var userDtos = users.Select(u => new UserDTO
//             {
//                 Id = u.Id,
//                 Username = u.Username,
//                 Email = u.Email,
//                 Role = u.Role
//             }).ToList();

//             return userDtos;
//         }

//         [HttpGet("getuserbyid/{id}")]
//         public async Task<ActionResult<UserDTO>> GetUser(int id)
//         {
//             // Get the current user's ID and role from the token
//             var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

//             if (userClaim == null) return Unauthorized("Invalid!! Token is missing");

//             var userId = int.Parse(userClaim.Value);

//             var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

//             // Check if the user is requesting their own data or is an Admin
//             if (id != userId && userRole != "Admin")
//             {
//                 return Forbid();
//             }

//             var user = await _context.Users.FindAsync(id);

//             if (user == null)
//             {
//                 return NotFound();
//             }

//             // Map user to UserDTO
//             var userDto = new UserDTO
//             {
//                 Id = user.Id,
//                 Username = user.Username,
//                 Email = user.Email,
//                 Role = user.Role
//             };

//             return userDto;
//         }

//         [HttpPut("updaterole/{id}")]
//         [Authorize(Policy = "RequireAdminRole")]
//         public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string role)
//         {
//             // Validate role
//             if (role != "Admin" && role != "User")
//             {
//                 return BadRequest("Invalid role. Role must be 'Admin' or 'User'");
//             }

//             // Find user by ID
//             var user = await _context.Users.FindAsync(id);
//             if (user == null)
//             {
//                 return NotFound();
//             }

//             // Update user role
//             user.Role = role;

//             // Save changes to database
//             try
//             {
//                 await _context.SaveChangesAsync();
//             }
//             catch (DbUpdateConcurrencyException)
//             {
//                 if (!UserExists(id))
//                 {
//                     return NotFound();
//                 }
//                 else
//                 {
//                     throw;
//                 }
//             }

//             return NoContent();
//         }

//         // Helper method to check if a user exists
//         private bool UserExists(int id)
//         {
//             return _context.Users.Any(e => e.Id == id);
//         }
//     }
// }
