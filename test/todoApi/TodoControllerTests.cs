namespace todoApiTests;

using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using todoApi.Authentication;
using todoApi.Controllers;
using todoApi.Models;
using todoApi.Providers;

[TestClass]
public class TodoControllerTests
{
    private ILogger<TodoController> testLogger;
    private IUserDetails testUserDetails;
    private ITodoListRepositoryEF testRepo;
    private TodoController testController;

    [TestInitialize]
    public void TestInitialize()
    {
        this.testLogger = NSubstitute.Substitute.For<ILogger<TodoController>>();
        this.testUserDetails = NSubstitute.Substitute.For<IUserDetails>();
        this.testRepo = Substitute.For<ITodoListRepositoryEF>();

        this.testController = new TodoController(this.testLogger, this.testUserDetails, this.testRepo);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentNullException))]
    public void ControllerThrowsNullException_NullLogger()
    {
        TodoController controller = new TodoController(null, this.testUserDetails, this.testRepo);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentNullException))]
    public void ControllerThrowsNullException_NullUserDetails()
    {
        TodoController controller = new TodoController(this.testLogger, null, this.testRepo);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentNullException))]
    public void ControllerThrowsNullException_NullRepo()
    {
        TodoController controller = new TodoController(this.testLogger, this.testUserDetails, null);
    }

    [TestMethod]
    public async Task GetTodoList_CallsRepo()
    {
        // Prepare
        var todoList = new todoApi.Models.TodoList();
        this.testUserDetails.HasUser.Returns(true);
        this.testUserDetails.UserId.Returns("testUser");
        this.testRepo.GetTodoList("testUser", "myTodoList").Returns(todoList);

        // Act
        var actionResult = this.testController.Get("myTodoList");

        // Assert
        actionResult.Should().BeOfType<OkObjectResult>();

        OkObjectResult result = actionResult as OkObjectResult;

        result.Should().NotBeNull();
        result.Value.Should().Be(todoList);
    }

    [TestMethod]
    public async Task CreateTodoList_CallsRepo()
    {
        // Prepare
        var inputList = new TodoList()
        {
            ListName = "testTodoList",
            Tasks = new List<TodoItem>(),
        };

        this.testUserDetails.HasUser.Returns(true);
        this.testUserDetails.UserId.Returns("testUser");
        this.testRepo.CreateTodoList("testUser", inputList.ListName).Returns(inputList);

        // Act
        var actionResult = this.testController.Create(inputList);

        // Assert
        actionResult.Should().BeOfType<CreatedAtActionResult>();

        CreatedAtActionResult result = actionResult as CreatedAtActionResult;

        result.Should().NotBeNull();
        result.Value.Should().Be(inputList);
        result.ActionName.Should().Be(nameof(TodoController.Get));
    }
}