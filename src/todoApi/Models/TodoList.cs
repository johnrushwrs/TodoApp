using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace todoApi.Models;

[JsonObject]
[PrimaryKey(nameof(id), nameof(ownerId))]
public class TodoList
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [JsonProperty(PropertyName = "id")]
    public string? id { get; set; }

    [JsonProperty(PropertyName = "ownerId")]
    public string? ownerId { get; set; }

    [JsonProperty(PropertyName = "listName")]
    public string? ListName { get; set; }

    [JsonProperty(PropertyName = "Tasks", NullValueHandling = NullValueHandling.Include)]
    public IList<TodoItem>? Tasks { get; set; }
}