using System;
using backend.Model;
using Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AuthDbContext: DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookMark> BookMarks{ get; set; }
    public DbSet<Cart> Carts{ get; set; }
    public DbSet<Announcement> Announcements{ get; set; }
    public DbSet<Review> Reviews{ get; set; }
    public DbSet<Order> Orders{ get; set; }
    public DbSet<OrderItem> OrderItems{ get; set; }
    public DbSet<Notification> Notifications { get; set; }  
    public object CartItems { get; internal set; }

    // internal async Task SaveChangesAsync()
    // {
    //     throw new NotImplementedException();
    // }
}
