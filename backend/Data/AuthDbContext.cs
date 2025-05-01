using System;
using Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class AuthDbContext: DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }

}
