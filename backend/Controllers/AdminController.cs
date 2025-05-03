using System.ComponentModel.DataAnnotations;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Announcement = backend.Model.Announcement;

namespace backend.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public AdminController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpPost("addBook")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddBook([FromForm] AddBookDTO addBook, IFormFile images)
        {
            if (await _context.Books.AnyAsync(b => b.Title == addBook.Title || b.ISBN == addBook.ISBN))
            {
                return BadRequest("Book with same titel or ISBN already exists");
            }
            // Upload the image
            string imageUrl = null;
            if (images != null && images.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(images.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await images.CopyToAsync(stream);
                }

                imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            }
            var book = new Book
            {
                BookId = Guid.NewGuid(),
                Title = addBook.Title,
                Description = addBook.Description,
                Author = addBook.Author,
                Genre = addBook.Genre,
                Image = imageUrl,
                PublishDate = addBook.PublishDate,
                Publisher = addBook.Publisher,
                Language = addBook.Language,
                Format = addBook.Format,
                ISBN = addBook.ISBN,
                Price = addBook.Price,
                Quantity = addBook.Quantity,
                Discount = addBook.Discount,
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Book created successfully",
                data = book
            });
        }


        [HttpDelete("deleteBook/{id}")]
        [Authorize("RequireAdminRole")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully." });
        }

        [HttpPut("updateBook/{id}")]
        [Authorize("RequireAdminRole")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromBody] AddBookDTO updatedBook)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            // Update book properties
            book.Title = updatedBook.Title;
            book.Description = updatedBook.Description;
            book.Author = updatedBook.Author;
            book.Genre = updatedBook.Genre;
            book.PublishDate = updatedBook.PublishDate;
            book.Publisher = updatedBook.Publisher;
            book.Language = updatedBook.Language;
            book.Format = updatedBook.Format;
            book.ISBN = updatedBook.ISBN;
            book.Price = updatedBook.Price;
            book.Quantity = updatedBook.Quantity;
            book.Discount = updatedBook.Discount;

            _context.Books.Update(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully.", data = book });
        }

        // get user details by admin
        [HttpGet("getuserdetails")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();

            // Map users to UserDTO
            var userDtos = users.Select(u => new UserDTO
            {
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                Role = u.Role
            }).ToList();

            return userDtos;
        }



    }


}
