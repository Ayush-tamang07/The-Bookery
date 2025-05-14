using backend.Data;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/announcement")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public AnnouncementController(AuthDbContext context)
        {
            _context = context;
        }
        [HttpPost("addannouncement")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> AddAnnouncement([FromBody] AddAnnouncementDTO dto)
        {
            if (dto.StartTime >= dto.EndTime)
                return BadRequest("Start time must be before end time.");
            var announcement = new Announcement
            {
                AnnouncementId = Guid.NewGuid(),
                message = dto.message,
                CreatedAt = dto.CreatedAt,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Announcement added successfully", data = announcement });
        }

        [HttpGet("getannouncementsbyadmin")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> GetAnnouncementsByAdmin()
        {
            var announcements = await _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AnnouncementDTO
                {
                    AnnouncementId = a.AnnouncementId,
                    message = a.message,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    CreatedAt = a.CreatedAt,
                    IsActive = a.IsActive,
                })
                .ToListAsync();

            return Ok(announcements);
        }

        [HttpDelete("deleteAnnouncement/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
            {
                return NotFound(new { message = "Announcement not found" });
            }
            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Announcement deleted successfully" });
        }

        [HttpGet("getannouncementbyuser")]
        public async Task<IActionResult> GetAnnouncements()
        {
            var announcements = await _context.Announcements
                .Where(a => a.IsActive && a.StartTime <= DateTime.UtcNow && a.EndTime >= DateTime.UtcNow)
                .Select(a => new AnnouncementDTO
                {
                    message = a.message,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    IsActive = a.IsActive
                })
                .ToListAsync();

            return Ok(announcements);
        }
        [HttpPut("updateannouncement/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateAnnouncement(Guid id, [FromBody] AddAnnouncementDTO dto)
        {
            if (dto.StartTime >= dto.EndTime)
                return BadRequest("Start time must be before end time.");

            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(new { message = "Announcement not found" });

            announcement.message = dto.message;
            announcement.StartTime = dto.StartTime;
            announcement.EndTime = dto.EndTime;
            announcement.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Announcement updated successfully", data = announcement });
        }

    }
}
