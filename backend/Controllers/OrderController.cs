using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
               private readonly AuthDbContext _context;
        public OrderController(AuthDbContext context)
        {
            _context = context;
        } 
    }
}
 