using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Data;

public class NumindsDbContext(DbContextOptions<NumindsDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Template> Templates => Set<Template>();
    public DbSet<Invitation> Invitations => Set<Invitation>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Template>(entity =>
        {
            entity.Property(t => t.Code).HasMaxLength(32).IsRequired();
            entity.Property(t => t.Category).HasMaxLength(64).IsRequired();
            entity.Property(t => t.ImageUrl).HasMaxLength(512).IsRequired();
            entity.HasIndex(t => t.Code).IsUnique();

            entity.HasData(SeedTemplates.All);
        });

        builder.Entity<Invitation>(entity =>
        {
            entity.Property(i => i.Status).HasMaxLength(32).IsRequired();

            entity.HasOne(i => i.User)
                .WithMany()
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(i => i.Template)
                .WithMany(t => t.Invitations)
                .HasForeignKey(i => i.TemplateId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
