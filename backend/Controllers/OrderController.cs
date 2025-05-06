using System.Security.Claims;
using backend.Data;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IEmailService _emailService;
        public OrderController(AuthDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }
        [HttpPost("placeorder")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> PlaceOrder()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            var cartItems = await _context.Carts
                .Include(c => c.Book)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty");

            if (cartItems.Any(c => c.Book == null))
                return BadRequest("One or more cart items do not have a valid book.");

            var totalQuantity = cartItems.Sum(c => c.Quantity);

            decimal subtotalAfterBookDiscounts = cartItems.Sum(c =>
                c.Quantity * (c.PricePerUnit * (1 - c.Book.Discount / 100m))
            );

            decimal cartLevelDiscount = (totalQuantity >= 5) ? 0.05m : 0;

            if (user.CompleteOrderCount == 10)
            {
                cartLevelDiscount += 0.10m;
                user.CompleteOrderCount = 0;
            }

            decimal finalTotal = subtotalAfterBookDiscounts * (1 - cartLevelDiscount);

            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                FinalAmount = subtotalAfterBookDiscounts,
                DiscountRate = cartLevelDiscount,
                Status = "Pending",
                ClaimCode = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                OrderItems = new List<OrderItem>()
            };

            foreach (var item in cartItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    OrderItemId = Guid.NewGuid(),
                    OrderId = order.OrderId,
                    BookId = item.BookId,
                    Quantity = item.Quantity,
                    PricePerUnit = item.PricePerUnit
                });
            }
            var receptor = user.Email;
            var subject = $"Order Confirmation Details - Order ID: {order.OrderId}";
            var body = $"Your order has been placed successfully. Order ID: {order.OrderId}. Claim Code: {order.ClaimCode}. Total Amount: {finalTotal}. Discount Applied: {cartLevelDiscount * 100}%.";
            await _emailService.SendEmail(receptor, subject, body);

            _context.Orders.Add(order);
            _context.Carts.RemoveRange(cartItems);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Order placed successfully",
                statusCode = 200,
                data = new
                {
                    orderId = order.OrderId,
                    claimCode = order.ClaimCode,
                    totalAmount = order.FinalAmount,
                    discountApplied = $"{cartLevelDiscount * 100}%"
                }
            });
        }
        [HttpPut("cancelorder/{orderId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult> CancelOrder(Guid orderId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Token is missing or invalid");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

            if (order == null) return NotFound("Order not found");

            // Check if the order is already completed or cancelled
            if (order.Status == "Completed" || order.Status == "Cancelled")
                return BadRequest("Cannot cancel a completed or already cancelled order");

            // Update the order status to "Cancelled"
            order.Status = "Cancelled";
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Order cancelled successfully",
                statusCode = 200,
                data = new
                {
                    orderId = order.OrderId,
                    status = order.Status
                }
            });
        }
        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] Email request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _emailService.SendEmail(request.Receptor, request.Subject, request.Body);
            return Ok(new
            {
                status = "success",
                message = "Email sent successfully",
                statusCode = 200
            });
        }
    }
}
