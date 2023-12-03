namespace todoApi.Authentication
{
    public class UserDetails : IUserDetails
    {
        private IHttpContextAccessor context;

        public UserDetails(IHttpContextAccessor context)
        {
            this.context = context;
        }

        public bool HasUser 
        {
            get => this.context.HttpContext?.User?.Identity != null;            
        }

        public string? UserId
        {
            get => this.context.HttpContext?.User?.Identity?.Name;
        }
    }
}