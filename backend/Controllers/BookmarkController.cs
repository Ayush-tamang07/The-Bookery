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
    [Route("api/bookmark")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public BookmarkController(AuthDbContext context)
        {
            _context = context;
        }
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
            .Include(b => b.Book) // This line loads the related Book entity
            .ToListAsync();

            if (!bookMarks.Any())
            {
                return NotFound(new { message = "No bookmarks found" });
            }

            var result = bookMarks.Select(b => new BookDTO
            {
                BookId = b.BookId,
                Title = b.Book.Title,
                Author = b.Book.Author,
                Price = b.Book.Price,
                Image = b.Book.Image,
                Discount = b.Book.Discount
            }).ToList();

            return Ok(result);
        }


        // [HttpDelete("deletebookmark/{id}")]
        // [Authorize(Policy = "RequireUserRole")]
        // public async Task<IActionResult> RemoveBookmark(Guid id)
        // {
        //     var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        //     if (userClaim == null)
        //         return Unauthorized("Invalid! Token is missing");

        //     var userId = Guid.Parse(userClaim.Value);

        //     // Find the bookmark by BookId and UserId
        //     var bookmark = await _context.BookMarks
        //         .FirstOrDefaultAsync(b => b.BookMarkId == id);

        //     if (bookmark == null)
        //         return NotFound(new { message = "Bookmark not found" });

        //     _context.BookMarks.Remove(bookmark);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Bookmark removed successfully" });
        // }
        [HttpDelete("removebookmark/{bookId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> RemoveWishlist(Guid bookId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var wishlist = await _context.BookMarks
            .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

            if (wishlist == null)
            {
                return Ok(new
                {
                    status = false,
                    code = 200,
                    message = "Book is not in the wishlist"
                });
            }

            _context.BookMarks.Remove(wishlist);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                status = true,
                statusCode = 200,
                message = "Book removed from wishlist successfully"
            });
        }
    }
}
