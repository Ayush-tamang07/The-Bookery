using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/search")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public SearchController(AuthDbContext context)
        {
            _context = context;
        }
        [HttpGet("searchbook")]
        public async Task<IActionResult> SearchBooks([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query is required.");
            }

            var loweredQuery = query.ToLower();

            var matchedBook = await _context.Books
                .Where(p => p.Title.ToLower().Contains(loweredQuery))
                .ToListAsync();

            return Ok(new
            {
                status = "success",
                results = matchedBook.Count,
                data = matchedBook
            });
        }


    }
}
