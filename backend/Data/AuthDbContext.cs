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

    internal async Task SaveChangesAsync()
    {
        throw new NotImplementedException();
    }
}
