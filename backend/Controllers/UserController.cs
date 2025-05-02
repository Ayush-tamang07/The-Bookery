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

        [HttpGet("getbook")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            var bookList = await _context.Books.ToListAsync();

            // Map users to UserDTO
            var book = bookList.Select(b => new BookDTO
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
                CreatedAt = b.CreatedAt
            }).ToList();

            return Ok(new
            {
                message = "Books retrieved successfully.",
                data = book
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
        [HttpPost("addbookmark")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> BookmarkBook(AddBookMark dto)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value); // Assuming your UserId is Guid

            var exists = await _context.BookMarks
                .AnyAsync(w => w.UserId == userId && w.BookId == dto.BookId);

            if (exists)
                return BadRequest("Already bookmarked");

            var BookMarks = new BookMark
            {
                UserId = userId,
                BookId = dto.BookId,

            };

            _context.BookMarks.Add(BookMarks);
            await _context.SaveChangesAsync();

            return Ok("Bookmarked successfully");
        }

        [HttpGet("getbookmark")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetBookMark()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var bookMarks = await _context.BookMarks
                .Where(b => b.UserId == userId)
                .ToListAsync();

            if (!bookMarks.Any())
            {
                return NotFound(new { message = "No bookmarks found" });
            }

            var result = bookMarks.Select(b => new BookMarkDTO
            {
                BookId = b.BookId,
                UserId = b.UserId
            }).ToList();

            return Ok(result);
        }



    }
}
