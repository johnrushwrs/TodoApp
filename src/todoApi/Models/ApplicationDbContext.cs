using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using todoApi.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace todoApi.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<TodoList> TodoLists { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.ConcurrencyStamp)
                    .IsETagConcurrency();
                
                entity.HasPartitionKey(e => e.Id);
                this.RegisterStorageMethod(entity, "Users");
            });

            builder.Entity<TodoList>(entity => 
            {
                entity.Property(e => e.id)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ownerId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasPartitionKey(e => e.ownerId);

                var ownedBuilder = entity.OwnsMany<TodoItem>("Tasks");
                ownedBuilder.Property(e => e.Completed);
                
                ownedBuilder.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(120);

                this.RegisterStorageMethod(entity, "TodoLists");
            });

            builder.Entity<IdentityRole>(entity => 
            {
                entity.Property(b => b.ConcurrencyStamp)
                    .IsETagConcurrency(); 
                this.RegisterStorageMethod(entity, "Roles");
            });
        }

        private void RegisterStorageMethod(EntityTypeBuilder builder, string storeName)
        {
            if (Database.IsRelational())
            {
                builder.ToTable(storeName);
            }
            else
            {
                builder.ToContainer(storeName);
            }
        }
    }
}