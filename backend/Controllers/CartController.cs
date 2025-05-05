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
    [Route("api/user")]
    [ApiController]
    public class CartController : ControllerBase
    {

        private readonly AuthDbContext _context;

        public CartController(AuthDbContext context)
        {
            _context = context;
        }


        [HttpPost("addtocart")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> addToCart([FromBody] AddToCartDTO dto)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            // Check if book exists
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null)
                return NotFound(new { message = "Book not found" });

            // Check if item already exists in cart (not yet checked out)
            var existingCartItem = await _context.Carts.FirstOrDefaultAsync(c =>
                c.UserId == userId &&
                c.BookId == dto.BookId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += dto.Quantity;
                existingCartItem.DateAdded = DateTime.UtcNow;
            }
            else
            {
                var cartItem = new Cart
                {
                    CartId = Guid.NewGuid(),
                    Quantity = dto.Quantity,
                    UserId = userId,
                    BookId = dto.BookId,
                    PricePerUnit = book.Price,
                    DateAdded = DateTime.UtcNow,
                };

                await _context.Carts.AddAsync(cartItem);
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Book added to cart successfully" });
        }
        [HttpGet("getCart")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetCart()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            // Fetch cart items for this user that are not checked out
            var cartItems = await _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Book)
                .Select(c => new
                {
                    c.CartId,
                    c.BookId,
                    c.Book.Title,
                    c.Book.Author,
                    c.Book.Image,
                    c.Book.Genre,
                    c.Quantity,
                    c.PricePerUnit,
                    TotalPrice = c.Quantity * c.PricePerUnit,
                    c.DateAdded
                })
                .ToListAsync();

            return Ok(cartItems);
        }
        // [HttpPut("updateCart/{id}")]
        // [Authorize(Policy = "RequireUserRole")]
        // public async Task<IActionResult> PutCart(Guid id)
        // {
        //     var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //     if (userClaim == null)
        //         return Unauthorized("Invalid! Token is missing");

        //     var userId = Guid.Parse(userClaim.Value);


        //     await _context.SaveChangesAsync();

        //     return Ok(new { success = true, message = "Cart item quantity updated successfully" });
        // }
        [HttpDelete("deletecart/{id}")]
        public async Task<IActionResult> DeleteCart(Guid id)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);
            var cartItem = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.CartId == id);
            if (cartItem == null)
                return NotFound(new { message = "Cart item not found" });
            _context.Carts.Remove(cartItem);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart item removed successfully" });
        }
    }
}
