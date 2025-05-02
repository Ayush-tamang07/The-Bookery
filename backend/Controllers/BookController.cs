// using backend.Data;
// using backend.DTOs.Request;
// using backend.Model;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Http;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;

// namespace backend.Controllers
// {
//     [Route("api/book")]
//     [ApiController]
//     public class BookController : ControllerBase
//     {
//         private readonly AuthDbContext _context;
//         public BookController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         [HttpPost("getBook")]
//         [Authorize(Policy = "RequireAdminRole")]
//         public async Task<IActionResult> GetBook()
//         {
            
//         }
//     }

// }

