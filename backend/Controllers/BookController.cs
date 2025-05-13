using backend.Data;
using backend.DTOs.Request;
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
        // [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetNewReleases()
        {
            DateTime threeMonthsAgo = DateTime.UtcNow.AddMonths(-3);

            var newBooks = await _context.Books
                .Where(b => b.PublishDate >= threeMonthsAgo)
                .OrderByDescending(b => b.PublishDate)
                .ToListAsync();

            return Ok(newBooks);
        }
        [HttpGet("newarrivals")]
        // [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetNewArrival()
        {
            DateTime MonthsAgo = DateTime.UtcNow.AddMonths(-1);

            var newBooks = await _context.Books
                .Where(b => b.PublishDate >= MonthsAgo)
                .OrderByDescending(b => b.PublishDate)
                .ToListAsync();

            return Ok(newBooks);
        }
        [HttpGet("awardwinning")]
        public async Task<IActionResult> GetAwardWinne(){
            var book = await _context.Books.Where(b => b.AwardWinner == true)
        .ToListAsync();
            return Ok(book);
        }

    }
}
