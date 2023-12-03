using System.ComponentModel.DataAnnotations.Schema;

namespace todoApi.Models;

public class TodoItem
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string? Id { get; set; }

    public bool Completed { get; set; }

    public string? Description { get; set; }
}