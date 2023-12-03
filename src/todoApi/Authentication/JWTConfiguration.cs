namespace todoApi.Authentication
{
    public class JWTConfiguration : IJWTConfiguration
    {
        public string ValidAudience { get; }
        public string ValidIssuer { get; }
        public string Secret { get; }

        public JWTConfiguration(string validAudience, string validIssuer, string secret)
        {
            this.ValidAudience = validAudience;
            this.ValidIssuer = validIssuer;
            this.Secret = secret;
        }
    }
}