// // using backend.Data;
// // using Microsoft.AspNetCore.Http;
// // using Microsoft.AspNetCore.Mvc;

// // namespace backend.Controllers
// // {
// //     [Route("api/order")]
// //     [ApiController]
// //     public class OrderController : ControllerBase
// //     {
// //         private readonly AuthDbContext _context;
// //         public OrderController(AuthDbContext context)
// //         {
// //             _context = context;
// //         }
// //     }
// // }

// using backend.Data;
// using backend.Model;
// using BookLibrary.Data;
// using BookLibrary.Model;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using System.Security.Claims;

// namespace BookLibrary.Controllers
// {
//     [Route("api/order")]
//     [ApiController]
//     public class OrderController : ControllerBase
//     {
//         private readonly AuthDbContext _context;

//         public OrderController(AuthDbContext context)
//         {
//             _context = context;
//         }

//         // Place Order - Accessible to Users
//         [HttpPost("placeorder")]
//         [Authorize(Policy = "RequireUserRole")]
//         public async Task<IActionResult> PlaceOrder()
//         {
//             var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
//             if (userClaim == null)
//                 return Unauthorized("Token is missing or invalid");

//             var userId = Guid.Parse(userClaim.Value);
//             var user = await _context.Users.FindAsync(userId);
//             if (user == null) return NotFound("User not found");

//             var cartItems = await _context.CartItems
//                 .Include(c => c.Book)
//                 .Where(c => c.UserId == userId)
//                 .ToListAsync();

//             if (!cartItems.Any())
//                 return BadRequest("Cart is empty");

//             var totalQuantity = cartItems.Sum(c => c.Quantity);

//             // Apply book-level discounts
//             decimal subtotalAfterBookDiscounts = cartItems.Sum(c =>
//                 c.Quantity * (c.PricePerUnit * (1 - c.Book.Discount / 100m))
//             );

//             //Apply cart-level discount if applicable
//             decimal cartLevelDiscount = (totalQuantity >= 5) ? 0.05m : 0;

//             // Step 3: Extra 10% if user has 10 completed orders
//             if (user.CompleteOrderCount == 10)
//             {
//                 cartLevelDiscount += 0.10m;
//                 // Reset after 10 completed orders
//                 user.CompleteOrderCount = 0;
//             }

//             decimal finalTotal = subtotalAfterBookDiscounts * (1 - cartLevelDiscount);

//             var order = new Order
//             {
//                 OrderId = Guid.NewGuid(),
//                 UserId = userId,
//                 OrderDate = DateTime.UtcNow,
//                 OriginalTotal = subtotalAfterBookDiscounts,
//                 DiscountRate = cartLevelDiscount,
//                 FinalTotal = finalTotal,
//                 Status = "Pending",
//                 ClaimCode = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
//                 OrderItems = new List<OrderItem>()
//             };

//             foreach (var item in cartItems)
//             {
//                 order.OrderItems.Add(new OrderItem
//                 {
//                     OrderItemId = Guid.NewGuid(),
//                     OrderId = order.OrderId,
//                     BookId = item.BookId,
//                     UserId = userId,
//                     Quantity = item.Quantity,
//                     PricePerUnit = item.PricePerUnit
//                 });
//             }

//             _context.Orders.Add(order);
//             _context.CartItems.RemoveRange(cartItems);
//             _context.Users.Update(user);
//             await _context.SaveChangesAsync();

//             return Ok(new
//             {
//                 status = "success",
//                 message = "Order placed successfully",
//                 statusCode = 200,
//                 data = new
//                 {
//                     orderId = order.OrderId,
//                     claimCode = order.ClaimCode,
//                     totalAmount = order.FinalTotal,
//                     discountApplied = $"{cartLevelDiscount * 100}%"
//                 }
//             });
//         }

//     }
// }