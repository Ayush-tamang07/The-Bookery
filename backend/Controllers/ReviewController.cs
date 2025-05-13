using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/review")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public ReviewController(AuthDbContext context)
        {
            _context = context;
        }
        [HttpPost("addreview/{id}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> AddReview(AddReviewDTO dto, Guid id)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var bookExists = await _context.Books.FindAsync(id);
            if (bookExists == null)
                return NotFound(new { success = false, message = "Book not found" });

            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { success = false, message = "Rating must be between 1 and 5" });

            // Check if the user purchased this book in any completed order
            var hasPurchased = await _context.OrderItems
                .Include(oi => oi.Order)
                .AnyAsync(oi => oi.BookId == id &&
                                oi.Order.UserId == userId &&
                                oi.Order.Status == "Completed");

            if (!hasPurchased)
            {
                return BadRequest(new { success = false, message = "You can only review books you have purchased in a completed order." });
            }

            // Check if review already exists
            var alreadyReviewed = await _context.Reviews
                .AnyAsync(r => r.UserId == userId && r.BookId == id);

            if (alreadyReviewed)
            {
                return BadRequest(new { success = false, message = "You have already reviewed this book." });
            }

            var review = new Review
            {
                ReviewId = Guid.NewGuid(),
                Comment = dto.Comment,
                Rating = dto.Rating,
                UserId = userId,
                BookId = id
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, status = 200, message = "Review submitted successfully." });
        }

        [HttpGet("getreview/{id}")]
        public async Task<IActionResult> FetchReviews(Guid id)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == id)
                .Select(r => new
                {
                    // r.ReviewId,
                    r.Comment,
                    r.Rating,
                    // r.BookId,
                    r.Book.Title,
                    r.CreatedAt,
                    // r.UserId,
                    Username = r.User.UserName
                })
                .ToListAsync();

            if (reviews.Count == 0)
                return NotFound(new { success = false, message = "No reviews found for this book" });

            return Ok(new { success = true, reviews });
        }
        [HttpGet("reviewbyadmin")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> FetchReviewsByAdmin()
        {
            var reviews = await _context.Reviews
                .Include(r => r.Book)
                .Include(r => r.User) // optional: if you want to show user info
                .Select(r => new
                {
                    r.ReviewId,
                    r.Comment,
                    r.Rating,
                    r.BookId,
                    BookTitle = r.Book.Title,
                    UserId = r.UserId,
                    // Optionally add more user details:
                    Username = r.User.UserName // assuming your User model has this
                })
                .ToListAsync();

            if (reviews.Count == 0)
                return NotFound(new { success = false, message = "No reviews found." });

            return Ok(new
            {
                success = true,
                count = reviews.Count,
                reviews
            });
        }
    }
}
