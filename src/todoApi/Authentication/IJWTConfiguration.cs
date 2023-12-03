namespace todoApi.Authentication
{
    public interface IJWTConfiguration
    {
        string ValidAudience { get; }
        string ValidIssuer { get; }
        string Secret { get; }
    }
}