namespace todoApi.Authentication
{
    public interface IUserDetails
    {
        bool HasUser { get; }
        string UserId { get; }
    }
}