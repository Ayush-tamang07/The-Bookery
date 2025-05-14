using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{

    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public UserController(AuthDbContext context)
        {
            _context = context;
        }

        // [HttpGet("getbook")]
        // public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        // {
        //     if (page <= 0 || pageSize <= 0)
        //     {
        //         return BadRequest(new
        //         {
        //             status = "error",
        //             code = 400,
        //             message = "Page and pageSize must be greater than 0"
        //         });
        //     }
        //     // var bookList = await _context.Books.ToListAsync();
        //     var totalBooks = await _context.Books.CountAsync();
        //     var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);
        //     var books = await _context.Books
        // .Skip((page - 1) * pageSize)
        // .Take(pageSize)
        // .ToListAsync();

        //     // Map users to UserDTO
        //     var book = books.Select(b => new BookDTO
        //     {
        //         BookId = b.BookId,
        //         Title = b.Title,
        //         Description = b.Description,
        //         Author = b.Author,
        //         Genre = b.Genre,
        //         Image = b.Image,
        //         PublishDate = b.PublishDate,
        //         Publisher = b.Publisher,
        //         Language = b.Language,
        //         Format = b.Format,
        //         ISBN = b.ISBN,
        //         Price = b.Price,
        //         Quantity = b.Quantity,
        //         Discount = b.Discount,
        //         CreatedAt = b.CreatedAt
        //     }).ToList();

        //     // return Ok(new
        //     // {
        //     //     message = "Books retrieved successfully.",
        //     //     data = book
        //     // });
        //     return Ok(new
        //     {
        //         status = "success",
        //         code = 200,
        //         message = "Books retrieved successfully",
        //         pagination = new
        //         {
        //             currentPage = page,
        //             pageSize = pageSize,
        //             totalPages = totalPages,
        //             totalItems = totalBooks
        //         },
        //         data = book
        //     });
        // }
        [HttpGet("getbook")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBookByUser(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest(new
                {
                    status = "error",
                    code = 400,
                    message = "Page and pageSize must be greater than 0"
                });
            }

            var totalBooks = await _context.Books.CountAsync();
            var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);

            var books = await _context.Books
                .Include(b => b.Reviews)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var bookDtos = books.Select(b => new BookDTO
            {
                BookId = b.BookId,
                Title = b.Title,
                Description = b.Description,
                Author = b.Author,
                Genre = b.Genre,
                Image = b.Image,
                PublishDate = b.PublishDate,
                Publisher = b.Publisher,
                Language = b.Language,
                Format = b.Format,
                ISBN = b.ISBN,
                Price = b.Price,
                Quantity = b.Quantity,
                Discount = b.Discount,
                CreatedAt = b.CreatedAt,
                 StartDate = b.StartDate,
                EndDate = b.EndDate,

                AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0,
                TotalReviews = b.Reviews.Count
            }).ToList();

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Books retrieved successfully",
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = totalPages,
                    totalItems = totalBooks
                },
                data = bookDtos
            });
        }

        [HttpGet("getbook/{id}")]
        public async Task<IActionResult> GetBookByID(Guid id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }
            return Ok(book);
        }

        // [HttpPost("addbookmark")]
        // public async Task<IActionResult> addBookmark(BookmarkDTO id)
        // {

        // }

        [HttpGet("getuserdetails")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetDetails()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var user = await _context.Users
                .Where(u => u.UserId == userId)
                .Select(u => new
                {
                    u.UserId,
                    u.UserName,
                    u.Email,
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }
        [HttpGet("fetchnotification")]
        [Authorize(Policy ="RequireUserRole")]
        public async Task<ActionResult> GetReview()
        {
            var notificaiton = await _context.Notifications.ToListAsync();
            return Ok(notificaiton);
        }
    }
}
