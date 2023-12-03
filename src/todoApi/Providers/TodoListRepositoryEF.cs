using Newtonsoft.Json;
using todoApi.Models;

namespace todoApi.Providers;

public class TodoListRepository : ITodoListRepository
{
    private const string todoDBName = "Todo";
    private const string todoListContainerName = "TodoLists";
    private ApplicationDbContext _dbContext;

    public TodoListRepository(ApplicationDbContext dbContext)
    {
        this._dbContext = dbContext;
    }

    public TodoList CreateTodoList(string userId, string listName)
    {
        var entry = this._dbContext.Add<TodoList>(new TodoList()
        {
            ownerId = userId,
            ListName = listName,
            Tasks = new List<TodoItem>(),
        });

        this._dbContext.SaveChanges();
        return entry.Entity;
    }

    public List<TodoList>? GetAllTodoLists(string userId)
    {
        var query = from list in this._dbContext.TodoLists
                    where list.ownerId == userId
                    select list;

        return query.Take(5).ToList();
    }

    public TodoList? GetTodoList(string userId, string todoListId)
    {
        return this._dbContext.Find<TodoList>(todoListId, userId);
    }

    public bool UpdateTodoList(string userId, TodoList updatedList)
    {
        TodoList updatedEntry = new TodoList()
        {
            id = updatedList.id,
            ownerId = updatedList.ownerId,
        };

        var tracker = this._dbContext.TodoLists.Entry(updatedEntry);
        var entry = this._dbContext.TodoLists.Find(updatedEntry.id, updatedEntry.ownerId);

        entry.Tasks = updatedList.Tasks;

        this._dbContext.SaveChanges();

        return true;
    }

    public TodoList? RemoveTodoList(string userId, string todoListId)
    {
        var deletedEntity = this._dbContext.Remove<TodoList>(this.GetTodoList(userId, todoListId)!).Entity;
        this._dbContext.SaveChanges();
        return deletedEntity;
    }
}