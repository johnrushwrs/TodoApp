using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using todoApi.Authentication;
using todoApi.Models;
using todoApi.Providers;
using todoApi.Utils;

namespace todoApi.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private readonly ILogger<TodoController> logger;
    private readonly IUserDetails userDetails;
    private readonly ITodoListRepository listRepo;

    public TodoController(
        ILogger<TodoController> logger,
        IUserDetails userDetails,
        ITodoListRepository todoListRepository)
    {
        ArgumentValidator.ThrowIfNull(nameof(logger), logger);
        ArgumentValidator.ThrowIfNull(nameof(userDetails), userDetails);
        ArgumentValidator.ThrowIfNull(nameof(todoListRepository), todoListRepository);

        this.logger = logger;
        this.userDetails = userDetails;
        this.listRepo = todoListRepository;
    }

    [HttpGet(Name = "GetTodoList")]
    [Route("{todoListId}")]
    public IActionResult Get(string todoListId)
    {
        TodoList? list = this.listRepo.GetTodoList(this.userDetails.UserId!, todoListId);

        logger.Log(LogLevel.Information, $"Retrieved list id was: {list.id}");

        return this.Ok(list);
    }

    [HttpPost]
    public IActionResult Create([FromBody] TodoList list)
    {
        // This doesn't allow for passing in a list of tasks, is that okay?
        string userId = this.userDetails.UserId!;
        var createdList = this.listRepo.CreateTodoList(userId!, list.ListName!);

        return this.CreatedAtAction(nameof(Get), createdList);
    }

    [HttpPatch]
    [Route("{todoListId}")]
    public IActionResult Update([FromBody] TodoList updatedList, string todoListId)
    {
        string userId = this.userDetails.UserId!;

        // need to set these manually
        updatedList.id = todoListId;
        updatedList.ownerId = userId;

        bool updateSuccess = this.listRepo.UpdateTodoList(userId!, updatedList);
        if (!updateSuccess)
        {
            throw new Exception("Failed to update the list!");
        }

        return this.NoContent();
    }

    [HttpGet]
    [Route("AllLists")]
    public IActionResult GetAllLists()
    {
        string userId = this.userDetails.UserId!;
        if (userId != null)
        {
            List<TodoList>? lists = this.listRepo?.GetAllTodoLists(userId);
            return this.Ok(lists);
        }

        return this.Unauthorized("User not authorized" + userId);
    }

    [HttpGet]
    [Route("{todoListId}/Tasks")]
    public IActionResult GetTasks(string todoListId)
    {
        string userId = this.userDetails.UserId!;
        if (userId != null)
        {
            TodoList? list = this.listRepo?.GetTodoList(userId, todoListId);
            return this.Ok(list?.Tasks);
        }

        return this.Unauthorized("User not authorized" + userId);
    }

    [HttpPost]
    [Route("{todoListId}/Tasks")]
    public IActionResult AddTasks([FromBody] IList<TodoItem> newTasks, string todoListId)
    {
        // Add the tasks that are passed in from the body to the todo list
        // if tasks are passed in with existing ids, take these as modifications 
        // to the originally existing tasks
        return null;
    }

    [HttpDelete]
    [Route("{todoListId}")]
    public IActionResult RemoveTasks(string todoListId)
    {
        string userId = this.userDetails.UserId!;
        if (userId != null)
        {
            TodoList? list = this.listRepo?.RemoveTodoList(userId, todoListId);
            Console.WriteLine("CALLING DELETE");
            return this.NoContent();
        }

        return this.Unauthorized("User not authorized" + userId);
    }
}
