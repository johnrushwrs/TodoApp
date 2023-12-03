namespace todoApi.Utils
{
    public static class ArgumentValidator
    {
        public static void ThrowIfNull(string argumentName, object arg)
        {
            if (arg == null)
            {
                throw new ArgumentNullException(argumentName);
            }
        }
    }
}