using System;
using System.ComponentModel.DataAnnotations;
using backend.Model;

namespace Backend.Model
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; } // PascalCase and "Id" instead of "ID"

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "User"; // Default role

        public ICollection<BookMark> BookMarks { get; set; }
        public ICollection<Cart> Carts { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}
