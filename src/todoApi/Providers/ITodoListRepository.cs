using todoApi.Models;

namespace todoApi.Providers;

public interface ITodoListRepository
{
    TodoList CreateTodoList(string userId, string listName);
    TodoList? GetTodoList(string userId, string todoListId);
    TodoList? RemoveTodoList(string userId, string todoListId);
    List<TodoList>? GetAllTodoLists(string userId);
    bool UpdateTodoList(string userId, TodoList updatedList);
}