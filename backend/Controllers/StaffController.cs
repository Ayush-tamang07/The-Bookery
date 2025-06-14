using backend.Data;
using backend.DTOs.Request;
using backend.Migrations;
using backend.Model;
using backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;
        public StaffController(AuthDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }
        [HttpPost("verify-claim-code")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<IActionResult> VerifyClaimCode([FromBody] VerifyClaimCodeDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book) 
                .FirstOrDefaultAsync(o => o.ClaimCode == request.ClaimCode);

            if (order == null)
            {
                return NotFound("Invalid claim code.");
            }

            if (order.Status == "Completed")
            {
                return BadRequest("This order is already marked as completed.");
            }

            foreach (var item in order.OrderItems)
            {
                if (item.Book != null)
                {
                    if (item.Book.Quantity < item.Quantity)
                    {
                        return BadRequest($"Insufficient stock for book: {item.Book.Title}");
                    }

                    item.Book.Quantity -= item.Quantity;
                }
            }

            order.Status = "Completed";
            order.ClaimCode = null;


            if (order.User != null)
            {
                order.User.CompleteOrderCount += 1;
            }

            string purchaserName = order.User?.UserName ?? "A user";
            string purchasedBooks = string.Join(", ", order.OrderItems.Select(i => i.Book.Title));

             await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Purchased Book", $"{purchaserName} has purchased: {purchasedBooks}");
             var addNotification = new Notification
             {
                 Message = $"{purchaserName} has purchased: {purchasedBooks}",
                //  CreatedAt = DateTime.UtcNow
             };

            _context.Notifications.Add(addNotification);
            await _context.SaveChangesAsync();

            return Ok("Claim code verified successfully. Order marked as completed and stock updated.");
        }

    }
}
