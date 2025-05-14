using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using backend.Service;
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
        public async Task<IActionResult> AddBook([FromForm] AddBookDTO addBook, IFormFile images, [FromServices] CloudinaryServices cloudinaryService)
        {
            if (await _context.Books.AnyAsync(b => b.Title == addBook.Title || b.ISBN == addBook.ISBN))
            {
                return BadRequest("Book with same titel or ISBN already exists");
            }
            // Upload the image
            string imageUrl = null;
            if (images != null)
            {
                imageUrl = await cloudinaryService.UploadImageAsync(images);
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
                // Discount = addBook.Discount,
                AwardWinner = addBook.AwardWinner,
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = 200,
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
        public async Task<IActionResult> UpdateBook(Guid id, [FromForm] AddBookDTO updatedBook, IFormFile images, [FromServices] CloudinaryServices cloudinaryService)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }
            string imageUrl = null;
            if (images != null)
            {
                imageUrl = await cloudinaryService.UploadImageAsync(images);
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
            book.Image = imageUrl ?? book.Image;


            _context.Books.Update(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book updated successfully.", data = book });
        }

        [HttpGet("getuserdetails")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users
            .Where(u => u.Role == "User" || u.Role == "Staff")
            .ToListAsync();

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
        [HttpGet("getbook")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
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
            // var bookList = await _context.Books.ToListAsync();
            var totalBooks = await _context.Books.CountAsync();
            var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);
            var books = await _context.Books
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

            // Map users to UserDTO
            var book = books.Select(b => new BookDTO
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
                AwardWinner = b.AwardWinner,
                StartDate = b.StartDate,
                EndDate = b.EndDate
            }).ToList();

            // return Ok(new
            // {
            //     message = "Books retrieved successfully.",
            //     data = book
            // });
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
                data = book
            }
            // , Console.WriteLine($"MessageWriter.Write(message: \"{message}\")");
            );
        }
        [HttpPut("updaterole/{email}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDTO dto, string email)
        {
            // Fetch user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Validate role input
            var allowedRoles = new List<string> { "Staff", "User" };
            if (!allowedRoles.Contains(dto.Role))
            {
                return BadRequest(new { message = "Invalid role specified." });
            }

            // Update role
            user.Role = dto.Role;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = 200,
                message = "User role updated successfully.",
                data = new
                {
                    user.UserId,
                    user.UserName,
                    user.Email,
                    user.Role
                }
            });
        }

        [HttpPut("discountoffer/{bookid}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult> DiscountOffer(Guid bookid, DiscountDTO discount)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null) return Unauthorized("Invalid !! Token is missing");

            var books = await _context.Books.FindAsync(bookid);
            if (books != null)
            {
                books.Discount = discount.Discount;
                books.StartDate = discount.StartDate;
                books.EndDate = discount.EndDate;
                // bookDetails.IsOnSale = discount.IsOnSale;
            }

            _context.Books.Update(books);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                status = "success",
                message = "Discount added successfully"
            });
        }
    }
}