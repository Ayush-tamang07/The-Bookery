using backend.Data;
using backend.DTOs.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public StaffController(AuthDbContext context)
        {
            _context = context;
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
                .Include(o => o.User) // Ensure related user is loaded
                .FirstOrDefaultAsync(o => o.ClaimCode == request.ClaimCode);

            if (order == null)
            {
                return NotFound("Invalid claim code.");
            }

            if (order.Status == "Completed")
            {
                return BadRequest("This order is already marked as completed.");
            }

            order.Status = "Completed";
            order.ClaimCode = null;

            // Increment completed order count
            if (order.User != null)
            {
                order.User.CompleteOrderCount += 1;
            }

            await _context.SaveChangesAsync();

            return Ok("Claim code verified successfully. Order marked as completed.");
        }



    }
}
