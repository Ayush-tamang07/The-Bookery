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
        public async Task<IActionResult> SearchBooks(
    [FromQuery] string? query,
    [FromQuery] string? genre,
    [FromQuery] string? language,
    [FromQuery] int? minPrice,
    [FromQuery] int? maxPrice,
    [FromQuery] string? sortBy,
    [FromQuery] string? sortDir = "asc"
)


        {
            var booksQuery = _context.Books.AsQueryable();

            // 🔍 Search by title
            if (!string.IsNullOrWhiteSpace(query))
            {
                var loweredQuery = query.ToLower();
                booksQuery = booksQuery.Where(b => b.Title.ToLower().Contains(loweredQuery));
            }

            // 🔘 Filter by Genre
            if (!string.IsNullOrWhiteSpace(genre))
            {
                booksQuery = booksQuery.Where(b => b.Genre.ToLower() == genre.ToLower());
            }

            // 🔘 Filter by Language
            if (!string.IsNullOrWhiteSpace(language))
            {
                booksQuery = booksQuery.Where(b => b.Language.ToLower() == language.ToLower());
            }

            // 💲 Filter by Min Price
            if (minPrice.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.Price >= minPrice.Value);
            }

            // 💲 Filter by Max Price
            if (maxPrice.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.Price <= maxPrice.Value);
            }

            // 🔃 Sorting (only price or default by CreatedAt)
            switch (sortBy?.ToLower())
            {
                case "price":
                    booksQuery = sortDir == "desc"
                        ? booksQuery.OrderByDescending(b => b.Price)
                        : booksQuery.OrderBy(b => b.Price);
                    break;

                default:
                    booksQuery = booksQuery.OrderByDescending(b => b.CreatedAt); // default sort
                    break;
            }

            var books = await booksQuery.ToListAsync();

            return Ok(new
            {
                status = "success",
                results = books.Count,
                data = books.Select(b => new
                {
                    b.BookId,
                    b.Title,
                    b.Author,
                    b.Genre,
                    b.Language,
                    b.Price,
                    b.Discount,
                    b.Image,
                    b.Description,
                    b.PublishDate
                })
            });
        }



    }
}
