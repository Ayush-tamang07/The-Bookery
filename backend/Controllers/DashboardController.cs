using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public DashboardController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("getdata")]
        [Authorize(Roles = "Staff,Admin")]
        public async Task<ActionResult> GetDashboardData()
        {
            int totalUsers = await _context.Users.CountAsync(u => u.Role == "User");
            int totalStaff = await _context.Users.CountAsync(u => u.Role == "Staff");
            int totalBooks = await _context.Books.CountAsync();
            int totalPendingOrder = await _context.Orders.CountAsync(o => o.Status == "Pending");
            int totalCompletedOrder = await _context.Orders.CountAsync(o => o.Status == "Completed");
            decimal totalRevinew = await _context.Orders
            .Where(o => o.Status == "Completed")
            .SumAsync(o => o.FinalAmount);
            int outOfStock = await _context.Books.CountAsync(b=> b.Quantity == 0);
            var latestOrders = await _context.Orders
                .Include(o => o.User) 
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    // o.OrderId,
                    o.OrderDate,
                    o.FinalAmount,
                    o.Status,
                    Username = o.User.UserName,
                    Email = o.User.Email
                })
                .ToListAsync();

            return Ok(new
            {
                totalUsers,
                totalStaff,
                totalBooks,
                totalPendingOrder,
                totalCompletedOrder,
                totalRevinew,
                outOfStock,
                latestOrders
            });
        }

    }
}
