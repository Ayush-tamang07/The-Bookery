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
    [Route("api/book")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public BookController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("newreleases")]
        public async Task<IActionResult> GetNewReleases()
        {
            DateTime threeMonthsAgo = DateTime.UtcNow.AddMonths(-3);

            var newBooks = await _context.Books
                .Where(b => b.CreatedAt >= threeMonthsAgo)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
            return Ok(newBooks);
        }

        [HttpGet("newarrivals")]
        public async Task<IActionResult> GetNewArrival()
        {
            DateTime MonthsAgo = DateTime.UtcNow.AddMonths(-1);

            var newBooks = await _context.Books
                .Where(b => b.CreatedAt >= MonthsAgo)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return Ok(newBooks);
        }
        [HttpGet("awardwinning")]
        public async Task<IActionResult> GetAwardWinner()
        {
            var book = await _context.Books.Where(b => b.AwardWinner == true)
        .ToListAsync();
            return Ok(book);
        }

        [HttpGet("commingsoon")]
        public async Task<IActionResult> CommingSoon()
        {
            var book = await _context.Books.Where(b => b.AvailableInLibrary == false)
        .ToListAsync();
            return Ok(book);
        }
        
        [HttpGet("deals")]
        public async Task<IActionResult> Deals()
        {
            var book = await _context.Books.Where(b => b.IsOnSale == true)
        .ToListAsync();
            return Ok(book);
        }

        [HttpGet("bestSeller")]
        public async Task<IActionResult> GetBestSellers()
        {
            var bestSellingBooks = await _context.OrderItems
                .GroupBy(oi => oi.BookId)
                .Select(group => new
                {
                    BookId = group.Key,
                    OrderCount = group.Count()
                })
                .OrderByDescending(g => g.OrderCount)
                .Take(10) 
                .ToListAsync();

            var bookIds = bestSellingBooks.Select(b => b.BookId).ToList();

            var books = await _context.Books
                .Where(b => bookIds.Contains(b.BookId))
                .ToListAsync();

            var result = bestSellingBooks
                .Join(books, b => b.BookId, book => book.BookId, (b, book) => new
                {
                    book = new BookDTO
                    {
                        BookId = book.BookId,
                        Title = book.Title,
                        Author = book.Author,
                        Genre = book.Genre,
                        ISBN = book.ISBN,
                        Image = book.Image,
                        Description = book.Description,
                        Publisher = book.Publisher,
                        PublishDate = book.PublishDate,
                        Price = book.Price,
                        Quantity = book.Quantity,
                        Language = book.Language,
                        Discount = book.Discount,
                        Format = book.Format,
                        // AvailableInLibrary = book.AvailableInLibrary,
                        // IsOnSale = book.IsOnSale
                        // AverageRating = book.Reviews.Any() ? book.Reviews.Average(r => r.Rating) : 0,
                        // TotalReviews = book.Reviews.Count
                    },
                    orderCount = b.OrderCount
                })
                .OrderByDescending(x => x.orderCount)
                .ToList();

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Top selling books fetched successfully",
                data = result
            });
        }
        // commentt

    }
}
